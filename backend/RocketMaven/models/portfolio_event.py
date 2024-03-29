import datetime

from RocketMaven.extensions import db
from RocketMaven.models.portfolio import Portfolio
from RocketMaven.models.portfolio_asset_holding import PortfolioAssetHolding
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship
import json


def default_FIFO_units(context):
    if context.get_current_parameters()["add_action"]:
        return context.get_current_parameters()["units"]
    else:
        return 0


class PortfolioEvent(db.Model):
    """Basic portfolio tracker model"""

    id = db.Column(db.Integer, primary_key=True)

    units = db.Column(db.Float(), unique=False, nullable=False)

    # Add (competition: buy) = True, Remove (competition: sell) = False
    add_action = db.Column(db.Boolean, default=False)

    fees = db.Column(db.Float(), unique=False, nullable=False)
    price_per_share = db.Column(db.Float(), unique=False, nullable=False)

    dynamic_after_FIFO_units = db.Column(
        db.Float(), unique=False, nullable=False, default=default_FIFO_units
    )

    exchange_rate = db.Column(db.Float(), unique=False, nullable=False)

    @hybrid_property
    def price_per_share_in_portfolio_currency(self):
        return self.price_per_share * self.exchange_rate

    pre_deleted = db.Column(db.Boolean, default=False)

    note = db.Column(db.String(1024), unique=False, nullable=True)

    tax_full_snapshot = db.Column(db.Text, unique=False, nullable=True)
    available_snapshot = db.Column(db.Float(), unique=False, nullable=True)
    realised_snapshot = db.Column(db.Float(), unique=False, nullable=True)

    event_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    asset_id = db.Column(
        db.String(80),
        db.ForeignKey("asset.ticker_symbol"),
        primary_key=False,
        nullable=False,
    )
    asset_for_event = relationship("Asset", backref="asset_for_event")
    asset_currency = association_proxy("asset_for_event", "currency")

    portfolio_id = db.Column(
        db.Integer, db.ForeignKey("portfolio.id"), primary_key=False, nullable=False
    )
    portfolio_for_event = relationship("Portfolio", backref="portfolio_for_event")
    portfolio_name = association_proxy("portfolio_for_event", "name")
    competition_portfolio = association_proxy(
        "portfolio_for_event", "competition_portfolio"
    )

    def __repr__(self):
        return "<PortfolioEvent %s>" % self.id

    @hybrid_property
    def dynamic_after_FIFO_value(self):
        return self.dynamic_after_FIFO_units * self.price_per_share

    def update_portfolio_asset_FIFO(asset_id, portfolio_id):

        asset_holding = PortfolioAssetHolding(
            asset_id=asset_id,
            portfolio_id=portfolio_id,
            last_updated=db.func.current_timestamp(),
            available_units=0,
            average_price=0,
            realised_total=0,
            latest_note="",
        )

        # FIFO update
        # Since add action and remove action can be performed out-of-order, this means that
        #     the add action will have to be recalculated every insertion attempt,
        #     since the remove event will be no longer tied to the current event.

        asset_events = (
            PortfolioEvent.query.filter_by(
                portfolio_id=portfolio_id, pre_deleted=False
            ).filter_by(asset_id=asset_id)
            # Consider adds before removes
            .order_by(PortfolioEvent.event_date.asc(), PortfolioEvent.add_action.desc())
        )
        add_events = asset_events.filter_by(add_action=True).all()

        # Reset dynamic_after_FIFO_units state
        for add_event in add_events:
            add_event.dynamic_after_FIFO_units = add_event.units

        past_add_events = []

        realised_running_local_sum = 0
        for event in asset_events.all():
            tax_full_snapshot = []
            # Loop through all asset events in order of creation (from earliest to latest)

            if event.add_action is False:
                # Get the sell events, these affect the FIFO calculations
                remove_event = event
                remove_total = remove_event.units

                for add_event in past_add_events:
                    # Loop through all add asset events in order of creation (from earliest to latest)

                    # Start subtracting remove_total from FIFO values
                    cached_FIFO = add_event.dynamic_after_FIFO_units
                    add_event.dynamic_after_FIFO_units = max(
                        cached_FIFO - remove_total, 0
                    )
                    removed_difference = (
                        cached_FIFO - add_event.dynamic_after_FIFO_units
                    )

                    remove_total -= removed_difference
                    current_realised = removed_difference * (
                        remove_event.price_per_share_in_portfolio_currency
                        - add_event.price_per_share_in_portfolio_currency
                    )

                    if not current_realised == 0:
                        event_tax_discount = False
                        if current_realised > 0:
                            # A profit, so check if the FIFO add event was from a year before the remove event
                            add_date = datetime.datetime.timestamp(
                                datetime.datetime.fromordinal(
                                    add_event.event_date.toordinal()
                                )
                            )
                            remove_date = datetime.datetime.timestamp(
                                datetime.datetime.fromordinal(
                                    remove_event.event_date.toordinal()
                                )
                            )
                            if remove_date - add_date >= 365 * 24 * 60 * 60:
                                # One year or more, pay half tax
                                event_tax_discount = True
                        tax_full_snapshot.append(
                            {
                                "ticker_symbol": add_event.asset_id,
                                "add_date": add_event.event_date.strftime("%Y-%m-%d"),
                                "remove_date": remove_event.event_date.strftime(
                                    "%Y-%m-%d"
                                ),
                                "discount": event_tax_discount,
                                "value": current_realised,
                            }
                        )

                    realised_running_local_sum += current_realised

                    if remove_total <= 0:
                        break

                # All units from remove event should be subtracted from the add events at this point
                # Any remainder results in an error (removing more than is held)
                if remove_total > 0:
                    return False

                asset_holding.available_units = sum(
                    [x.dynamic_after_FIFO_units for x in past_add_events]
                )
            elif event.add_action is True:
                add_event = event
                # Buy
                # Update the average price only on buy
                past_add_events.append(add_event)

                # That dynamic_after_FIFO_units affects the available units at the current event's timepoint
                # Note that the current add event is considered to be available for the purpose of calculations
                available_units = sum(
                    [x.dynamic_after_FIFO_units for x in past_add_events]
                )

                previous_update = (
                    asset_holding.available_units * asset_holding.average_price
                )
                new_update = (
                    add_event.units * add_event.price_per_share_in_portfolio_currency
                )

                # Recalculate the new average price
                new_average_price = (previous_update + new_update) / available_units
                asset_holding.average_price = new_average_price

                asset_holding.available_units = available_units

            # Push the last event's note to the asset holding information
            if event.note and len(event.note.strip()) > 0:
                asset_holding.latest_note = event.note

            # Save a copy of the event's data for the report
            event.available_snapshot = asset_holding.available_units
            event.tax_full_snapshot = json.dumps(tax_full_snapshot)
            event.realised_snapshot = realised_running_local_sum

        asset_holding.realised_total = realised_running_local_sum

        db.session.merge(asset_holding)
        return True

    def update_portfolio_asset_holding(self) -> bool:
        """Calculates the FIFO portfolio holding properties when an event occurs"""

        # Add the event to the database (neat helper feature)
        db.session.add(self)
        db.session.flush()
        portfolio_event = self

        # Affect the competition portfolio buying power more globally
        # Competition portfolios do not allow out-of-sequence (by date) events, so this is safe
        portfolio_query = Portfolio.query.filter_by(
            id=portfolio_event.portfolio_id
        ).first()

        if portfolio_query and portfolio_query.competition_portfolio is True:
            buying_power_diff = 0
            if portfolio_event.add_action is True:
                # Buy
                buying_power_diff = -(
                    portfolio_event.price_per_share
                    * portfolio_event.exchange_rate
                    * portfolio_event.units
                )
            else:
                # Sell
                buying_power_diff = (
                    portfolio_event.price_per_share
                    * portfolio_event.exchange_rate
                    * portfolio_event.units
                )

            # Affect buying power
            portfolio_query.buying_power += buying_power_diff

        # Run the FIFO refresh algorithm.
        return PortfolioEvent.update_portfolio_asset_FIFO(
            portfolio_event.asset_id, portfolio_event.portfolio_id
        )
