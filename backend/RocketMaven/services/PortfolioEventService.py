from flask import request
from RocketMaven.api.schemas import PortfolioEventSchema, PortfolioAssetHoldingSchema
from RocketMaven.models import PortfolioEvent, PortfolioAssetHolding, Portfolio, Asset
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate
import sqlalchemy.exc
from sqlalchemy import func
import csv
import io
import datetime
import requests

YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=longName,shortName,regularMarketPrice"


def update_asset(asset) -> (bool, str):
    """Updates the asset current price from the Yahoo Finance API
    Returns True (and an empty string) if there were no issues
        False and an error message if an error was encountered.
    """
    exchange, stock = asset.ticker_symbol.split(":")

    if datetime.datetime.now() - asset.price_last_updated < datetime.timedelta(
        minutes=10
    ):
        return True, "Asset Price not updated"

    if exchange != "VIRT":
        # For finance yahoo, the ticker needs to be formatted according to its exchange
        if exchange == "CRYPTO":
            # For CRYPTO, the price is the current USD value (similar to how forex works)
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker="-".join([stock, "USD"]))
        elif exchange == "ASX":
            # For the ASX, the ticker is a combination of the asset code and ".AX"
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=".".join([stock, "AX"]))
        else:
            # For american? stocks it is just the plain asset code
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=stock)

        try:
            print(endpoint)
            response = requests.get(endpoint)
            print(response)
            if response.status_code == 200:
                data = response.json()
                print(data)
                try:
                    err = data["quoteResponse"]["error"]
                    print(err)
                    if err is not None:
                        return False, "Error with API response {}".format(err)
                    asset.current_price = data["quoteResponse"]["result"][0][
                        "regularMarketPrice"
                    ]["raw"]
                    asset.price_last_updated = datetime.datetime.now()
                    db.session.commit()
                except IndexError:
                    return False, "Malformed API response"
        except Exception as err:
            return False, "Error updating current price - {}".format(err)
    return True, ""


def delete_holding(portfolio_id):
    """Deletes an asset from a portfolio
    Returns
        200 - a asset is deleted successfully
        500 - if an unexpected exception occurs
    """
    asset_id = request.json.get("asset_id")
    print(asset_id)
    query = PortfolioEvent.query.filter_by(
        portfolio_id=portfolio_id, asset_id=asset_id
    ).all()
    for m in query:
        m.dynamic_after_FIFO_units = 0

    query = PortfolioAssetHolding.query.filter_by(
        portfolio_id=portfolio_id, asset_id=asset_id
    ).first()
    query.available_units = 0

    db.session.commit()

    return {"msg": "success"}, 200


def get_events(portfolio_id):
    """Get the list of (asset) events in a portfolio
    Returns
        200 - a paginated list of Portfolio events
        500 - if an unexpected exception occurs
    """
    schema = PortfolioEventSchema(many=True)
    query = PortfolioEvent.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)


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
    """Maps a csv column to a PortfolioEvent-compatible structure"""
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
        print(output_map["event_date"])

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
                "msg": "portfolio does not exist!",
            },
            400,
        )

    file_mode = False

    if "files[]" not in request.files:
        # Handle direct form asset event input
        try:
            if query.competition_portfolio == True:
                request.json["price_per_share"] = 0
                request.json["fees"] = 0

            portfolio_event = schema.load(request.json)
            portfolio_event.portfolio_id = portfolio_id
            portfolio_events = [portfolio_event]
        except Exception as e:
            print(e)
            return (
                {
                    "msg": "error encountered in input asset creation json!",
                },
                500,
            )
    else:
        # Handle CSV events import
        portfolio_events = []
        try:
            for form_file in request.files.getlist("files[]"):
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
            return (
                {
                    "msg": f"issue processing csv file! {e}",
                },
                500,
            )

        if file_mode == False:
            return (
                {
                    "msg": "no files in form found!",
                },
                400,
            )

    if query.competition_portfolio == True and (len(portfolio_events) > 1 or file_mode):
        return (
            {
                "msg": "competition portfolio event failed, cannot bulk add to a competition portfolio",
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
                        "msg": "event failed, units cannot be negative or zero",
                    },
                    400,
                )

            # Competition portfolio ignores any user-set price. So the user should be able to refresh the real-time price that the system provides to make an informed competition entry.
            if query.competition_portfolio == True:
                portfolio_event.event_date = None
                asset = Asset.query.filter_by(
                    ticker_symbol=portfolio_event.asset_id
                ).first()
                update_asset(asset)
                portfolio_event.price_per_share = asset.current_price

                if (
                    portfolio_event.add_action == True
                    and portfolio_event.price_per_share * portfolio_event.units
                    > query.buying_power
                ):
                    db.session.rollback()
                    return (
                        {
                            "msg": "competition portfolio event failed, insufficient buying power",
                        },
                        400,
                    )

            if portfolio_event.price_per_share <= 0:
                db.session.rollback()
                return (
                    {
                        "msg": "event failed, price per share cannot be negative or zero",
                    },
                    400,
                )

            portfolio_holdings = PortfolioAssetHolding.query.filter_by(
                portfolio_id=portfolio_id, asset_id=portfolio_event.asset_id
            ).first()

            if (
                portfolio_holdings
                and portfolio_holdings.available_units - portfolio_event.units < 0
            ):
                db.session.rollback()
                return (
                    {
                        "msg": "event failed, cannot remove more units then available",
                    },
                    400,
                )

            portfolio_event.update_portfolio_asset_holding()
            output_events.append(portfolio_event)

        db.session.commit()
        return (
            {
                "msg": "portfolio events created",
                "portfolio event": [schema.dump(x) for x in output_events],
            },
            201,
        )
    except Exception as e:
        print(e)
        db.session.rollback()

        return (
            {
                "msg": "an unknown error has occured creating the portfolio event",
            },
            500,
        )
