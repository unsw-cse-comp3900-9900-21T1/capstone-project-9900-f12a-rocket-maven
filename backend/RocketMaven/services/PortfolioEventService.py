from flask import request
from RocketMaven.api.schemas import PortfolioEventSchema, PortfolioAssetHoldingSchema
from RocketMaven.models import PortfolioEvent, PortfolioAssetHolding, Portfolio, Asset
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate
import sqlalchemy.exc

import requests

YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=longName,shortName,regularMarketPrice"


def update_asset(asset) -> (bool, str):
    """ Updates the asset current price from the Yahoo Finance API
        Returns True (and an empty string) if there were no issues
            False and an error message if an error was encountered.
    """
    exchange, stock = asset.ticker_symbol.split(":")

    if exchange != "VIRT":
        # For finance yahoo, the ticker needs to be formatted according to its exchange
        if exchange == "ASX":
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
                    db.session.commit()
                except IndexError:
                    return False, "Malformed API response"
        except Exception as err:
            return False, "Error updating current price - {}".format(err)
    return True, ""


def get_events(portfolio_id):
    """ Get the list of (asset) events in a portfolio 
        Returns
            200 - a paginated list of Portfolio events
            500 - if an unexpected exception occurs
    """
    schema = PortfolioEventSchema(many=True)

    # Get the assets that are part of this portfolio
    assets = (
        db.session()
        .query(Asset)
        .join(PortfolioEvent)
        .filter_by(portfolio_id=portfolio_id)
        .distinct(PortfolioEvent.asset_id)
        .all()
    )
    for asset in assets:
        ok, msg = update_asset(asset)
        if not ok:
            return (
                {
                    "msg": "Unable to update asset {} - {}".format(
                        asset.ticker_symbol, msg
                    )
                },
                500,
            )

    query = PortfolioEvent.query.filter_by(portfolio_id=portfolio_id)

    return paginate(query, schema)


def get_holdings(portfolio_id):
    """ Get the list of asset holdings in a portfolio
        Returns
            200 - a paginated list of asset holdings
            500 - if an unexpected exception occurs
    """
    schema = PortfolioAssetHoldingSchema(many=True)

    # Get the assets that are part of this portfolio
    assets = (
        db.session()
        .query(Asset)
        .join(PortfolioEvent)
        .filter_by(portfolio_id=portfolio_id)
        .distinct(PortfolioEvent.asset_id)
        .all()
    )
    for asset in assets:
        ok, msg = update_asset(asset)
        if not ok:
            return (
                {
                    "msg": "Unable to update asset {} - {}".format(
                        asset.ticker_symbol, msg
                    )
                },
                500,
            )

    query = PortfolioAssetHolding.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)


def create_event(portfolio_id):
    """ Create a new asset for the given portfolio in the database
        Returns
            201 - on successful asset creation
            400 - Foreign key error (unknown portfolio or asset id)
            500 - unexpected error
    """

    schema = PortfolioEventSchema()

    portfolio_event = schema.load(request.json)
    portfolio_event.portfolio_id = portfolio_id
    query = Portfolio.query.filter_by(id=portfolio_id).first()

    # Competition portfolio ignores any user-set price. So the user should be able to refresh the real-time price that the system provides to make an informed competition entry.
    if query.competition_portfolio == True:
        asset = Asset.query.filter_by(ticker_symbol=portfolio_event.asset_id).first()
        update_asset(asset)
        portfolio_event.price_per_share = asset.current_price

        if (
            portfolio_event.add_action == True
            and portfolio_event.price_per_share * portfolio_event.units
            > query.buying_power
        ):
            return (
                {
                    "msg": "competition portfolio event failed, insufficient buying power",
                },
                400,
            )

    db.session.add(portfolio_event)
    buying_power_diff = portfolio_event.update_portfolio_asset_holding()

    if query.competition_portfolio == True:
        buying_power_diff = 0
        if portfolio_event.add_action == True:
            # Buy
            buying_power_diff = -(
                portfolio_event.price_per_share * portfolio_event.units
            )
        else:
            # Sell
            buying_power_diff = portfolio_event.price_per_share * portfolio_event.units

        query.buying_power += buying_power_diff

    db.session.commit()


    return (
        {
            "msg": "portfolio event created",
            "portfolio event": schema.dump(portfolio_event),
        },
        201,
    }