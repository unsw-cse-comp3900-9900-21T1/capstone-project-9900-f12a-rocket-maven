import csv
import datetime
import io

from flask import request
from flask_jwt_extended import get_jwt_identity
from RocketMaven.api.schemas import (PortfolioAssetHoldingSchema,
                                     PortfolioEventSchema)
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import (Asset, Portfolio, PortfolioAssetHolding,
                                PortfolioEvent)
from RocketMaven.services.AssetService import (get_current_exchange,
                                               update_asset)


def protect_unauthorised_secure(func):
    def wrapper(portfolio_id):

        portfolio = Portfolio.query.filter_by(id=portfolio_id).first()

        if not portfolio:
            return (
                {
                    "msg": "Portfolio does not exist!",
                },
                404,
            )

        if portfolio.investor_id is not get_jwt_identity():
            return (
                {
                    "msg": "Access forbidden!",
                },
                401,
            )

        return func(portfolio_id)

    return wrapper


def protect_unauthorised_public(func):
    def wrapper(portfolio_id):

        portfolio = Portfolio.query.filter_by(id=portfolio_id).first()

        if not portfolio:
            return (
                {
                    "msg": "Portfolio does not exist!",
                },
                404,
            )

        if (
            portfolio.public_portfolio is not True
            and portfolio.investor_id is not get_jwt_identity()
        ):
            return (
                {
                    "msg": "Access forbidden!",
                },
                401,
            )

        return func(portfolio_id)

    return wrapper


@protect_unauthorised_secure
def delete_holding(portfolio_id):
    """Deletes an asset from a portfolio
    Returns
        200 - a asset is deleted successfully
        500 - if an unexpected exception occurs
    """

    asset_id = request.json.get("asset_id")

    query = PortfolioEvent.query.filter_by(
        portfolio_id=portfolio_id, asset_id=asset_id
    ).all()
    if query is None or len(query) == 0:
        return {"msg": "Asset not found"}, 404
    for m in query:
        m.dynamic_after_FIFO_units = 0

    query = PortfolioAssetHolding.query.filter_by(
        portfolio_id=portfolio_id, asset_id=asset_id
    ).first()
    if query is None:
        return {"msg": "Asset Holding not found"}, 404

    query.available_units = 0

    db.session.commit()

    return {"msg": "success"}, 200


@protect_unauthorised_public
def get_events(portfolio_id):
    """Get the list of (asset) events in a portfolio
    Returns:
        200 - a paginated list of Portfolio events
        500 - if an unexpected exception occurs
    """

    schema = PortfolioEventSchema(many=True)
    query = PortfolioEvent.query.filter_by(portfolio_id=portfolio_id).order_by(
        PortfolioEvent.event_date.asc()
    )
    return paginate(query, schema)


@protect_unauthorised_public
def get_holdings(portfolio_id):
    """Get the list of asset holdings in a portfolio
    Returns
        200 - a paginated list of asset holdings
        500 - if an unexpected exception occurs
    """

    schema = PortfolioAssetHoldingSchema(many=True)
    query = PortfolioAssetHolding.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)


def handle_broker_csv_row(csv_input_row: dict) -> dict:
    """ Maps a csv column to a PortfolioEvent-compatible structure """
    output_map = {
        "add_action": False,
        "asset_id": None,
        "event_date": "2021-01-01",
        "fees": 1,
        "price_per_share": 1,
        "units": 1,
    }

    if "Trade Date" in csv_input_row:
        output_map["event_date"] = str(
            datetime.datetime.strptime(csv_input_row["Trade Date"], "%d-%m-%y")
        )

    if "Exchange Rate" in csv_input_row:
        output_map["exchange_rate"] = csv_input_row["Exchange Rate"]

    if "Exchange" in csv_input_row and "Symbol" in csv_input_row:
        output_map["asset_id"] = (
            csv_input_row["Exchange"] + ":" + csv_input_row["Symbol"]
        )

    if "Quantity" in csv_input_row:
        output_map["units"] = csv_input_row["Quantity"]

    if "Price" in csv_input_row:
        output_map["price_per_share"] = csv_input_row["Price"]

    if "Transaction Type" in csv_input_row:
        output_map["add_action"] = csv_input_row["Transaction Type"] == "BUY"

    print(output_map)

    return output_map


@protect_unauthorised_secure
def create_event(portfolio_id):
    """Create a new asset for the given portfolio in the database
    Returns
        201 - on successful asset creation
        400 - Foreign key error (unknown portfolio or asset id)
        500 - unexpected error
    """

    schema = PortfolioEventSchema()

    query = Portfolio.query.filter_by(id=portfolio_id).first()

    if not query:
        return (
            {
                "msg": "Portfolio does not exist!",
            },
            400,
        )

    file_mode = False

    if "files[]" not in request.files:
        # Handle direct form asset event input
        try:
            if query.competition_portfolio is True:
                request.json["price_per_share"] = 0
                request.json["fees"] = 0
                request.json["exchange_rate"] = 1

            portfolio_event = schema.load(request.json)
            portfolio_event.portfolio_id = portfolio_id
            portfolio_events = [portfolio_event]
        except Exception as e:
            print(e)
            return (
                {
                    "msg": "Error encountered in processing the form!",
                },
                500,
            )
    else:
        # Handle CSV events import
        portfolio_events = []
        try:
            for form_file in request.files.getlist("files[]") + request.files.getlist(
                "files"
            ):
                tmp_file = io.StringIO(form_file.stream.read().decode("utf-8"))
                csv_file = csv.DictReader(tmp_file)
                for m in csv_file:

                    # Normalise different CSV formats to one that our system can understand
                    portfolio_event = schema.load(handle_broker_csv_row(m))
                    portfolio_event.portfolio_id = portfolio_id
                    portfolio_events.append(portfolio_event)
                    file_mode = True

        except Exception as e:
            file_mode = False
            print(e)
            return (
                {
                    "msg": f"Issue processing csv file! {e}",
                },
                500,
            )

        if file_mode is False:
            return (
                {
                    "msg": "No files in form found!",
                },
                400,
            )

    if query.competition_portfolio is True and (len(portfolio_events) > 1 or file_mode):
        return (
            {
                "msg": "Competition portfolio event failed, cannot bulk add to a competition portfolio",
            },
            400,
        )

    try:
        output_events = []
        for portfolio_event in portfolio_events:

            if portfolio_event.units <= 0:
                db.session.rollback()
                return (
                    {
                        "msg": "Units cannot be negative or zero",
                    },
                    400,
                )

            # Competition portfolio ignores any user-set price. So the user should be able to refresh the real-time
            # price that the system provides to make an informed competition entry.
            if query.competition_portfolio is True:
                portfolio_event.event_date = None
                asset = Asset.query.filter_by(
                    ticker_symbol=portfolio_event.asset_id
                ).first()
                update_asset(asset)
                portfolio_event.price_per_share = asset.current_price
                portfolio_event.exchange_rate = get_current_exchange(
                    asset.currency, query.currency
                )

                if (
                    portfolio_event.add_action is True
                    and portfolio_event.price_per_share_in_portfolio_currency
                    * portfolio_event.units
                    > query.buying_power
                ):
                    db.session.rollback()
                    return (
                        {
                            "msg": "Competition portfolio event failed, insufficient buying power",
                        },
                        400,
                    )

            if portfolio_event.price_per_share_in_portfolio_currency <= 0:
                db.session.rollback()
                return (
                    {
                        "msg": "Price per share cannot be negative or zero",
                    },
                    400,
                )

            portfolio_holdings = PortfolioAssetHolding.query.filter_by(
                portfolio_id=portfolio_id, asset_id=portfolio_event.asset_id
            ).first()

            if (
                portfolio_holdings
                and portfolio_holdings.available_units - portfolio_event.units < 0
                and portfolio_event.add_action is False
            ) or (not portfolio_holdings and portfolio_event.add_action is False):
                db.session.rollback()
                return (
                    {
                        "msg": "Cannot remove more units then available",
                    },
                    400,
                )

            portfolio_event.update_portfolio_asset_holding()
            output_events.append(portfolio_event)

        db.session.commit()
        return (
            {
                "msg": "Portfolio Event(s) Created",
                "portfolio event": [schema.dump(x) for x in output_events],
            },
            201,
        )
    except Exception as e:
        print(e)
        db.session.rollback()

        return (
            {
                "msg": "An unknown error has occured creating the portfolio event",
            },
            500,
        )
