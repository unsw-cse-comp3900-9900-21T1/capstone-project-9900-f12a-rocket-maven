from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import func
from RocketMaven.models.portfolio_asset_holding import PortfolioAssetHolding
from RocketMaven.models.asset import Asset

from RocketMaven.extensions import db, pwd_context


def default_FIFO_units(context):
    return context.get_current_parameters()["units"]


class PortfolioEvent(db.Model):
    """Basic portfolio tracker model"""

    id = db.Column(db.Integer, primary_key=True)

    units = db.Column(db.Float(), unique=False, nullable=False)

    # Add (competition: buy) = True, Remove (competition: sell) = False
    add_action = db.Column(db.Boolean, default=False)

    fees = db.Column(db.Float(), unique=False, nullable=False)
    price_per_share = db.Column(db.Float(), unique=False, nullable=False)

    at_the_time_history_units = db.Column(db.Float(), unique=False, nullable=True)
    at_the_time_history_price = db.Column(db.Float(), unique=False, nullable=True)

    dynamic_after_FIFO_units = db.Column(
        db.Float(), unique=False, nullable=False, default=default_FIFO_units
    )

    note = db.Column(db.String(1024), unique=False, nullable=True)

    event_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    asset_id = db.Column(
        db.String(80),
        db.ForeignKey("asset.ticker_symbol"),
        primary_key=False,
        nullable=False,
    )
    portfolio_id = db.Column(
        db.Integer, db.ForeignKey("portfolio.id"), primary_key=False, nullable=False
    )

    def __repr__(self):
        return "<PortfolioTracks %s>" % self.id

    @hybrid_property
    def dynamic_after_FIFO_value(self):
        return self.dynamic_after_FIFO_units * self.price_per_share

    def update_portfolio_asset_holding(self):

        portfolio_event = self

        asset_price = Asset.query.filter_by(
            ticker_symbol=portfolio_event.asset_id
        ).first()

        asset_holding = PortfolioAssetHolding.query.filter_by(
            portfolio_id=portfolio_event.portfolio_id
        ).filter_by(asset_id=portfolio_event.asset_id)

        if asset_price:
            asset_price = asset_price.current_price

            if portfolio_event.add_action == False:
                # Sell
                # FIFO update
                asset_events = (
                    PortfolioEvent.query.filter_by(
                        portfolio_id=portfolio_event.portfolio_id
                    )
                    .filter_by(asset_id=portfolio_event.asset_id)
                    .filter_by(add_action=True)
                    .filter(PortfolioEvent.dynamic_after_FIFO_units > 0)
                    .order_by(PortfolioEvent.event_date)
                ).all()

                remove_total = portfolio_event.units

                # Loop through all asset events in order of creation (from earliest to latest)
                for m in asset_events:

                    # Start subtracting remove_total from FIFO values
                    cached_FIFO = m.dynamic_after_FIFO_units
                    m.dynamic_after_FIFO_units = max(cached_FIFO - remove_total, 0)

                    remove_total -= cached_FIFO - m.dynamic_after_FIFO_units

                    if remove_total <= 0:
                        break
                db.session.commit()

                for m in PortfolioEvent.query.all():
                    print(m.dynamic_after_FIFO_value)
                print()
                print()

            available_units = (
                db.session.query(
                    PortfolioEvent,
                    func.sum(PortfolioEvent.dynamic_after_FIFO_units).label("value"),
                )
                .filter_by(portfolio_id=portfolio_event.portfolio_id)
                .filter_by(asset_id=portfolio_event.asset_id)
                .filter_by(add_action=True)
                .first()
                .value
            )

            print("Available units: ", available_units, portfolio_event.note)

            if portfolio_event.add_action == True:
                # Buy
                if not asset_holding:
                    asset_holding = PortfolioAssetHolding(
                        asset_id=portfolio_event.asset_id,
                        portfolio_id=portfolio_event.portfolio_id,
                        market_price=0,
                        last_updated=db.func.current_timestamp(),
                        available_units=0,
                        average_price=0,
                        realised_total=0,
                        note="",
                    )
                print("\t", asset_price)

                # Update the average price only on buy
                total_aggregations = (
                    db.session.query(
                        PortfolioEvent,
                        func.sum(PortfolioEvent.dynamic_after_FIFO_value).label(
                            "purchase_cost"
                        ),
                    )
                    .filter_by(portfolio_id=portfolio_event.portfolio_id)
                    .filter_by(asset_id=portfolio_event.asset_id)
                    .filter_by(add_action=True)
                    .first()
                )

                db.session.commit()

                print(
                    "Average price: ",
                    total_aggregations.purchase_cost / available_units,
                )

        else:
            raise Exception("Asset does not exist!")
