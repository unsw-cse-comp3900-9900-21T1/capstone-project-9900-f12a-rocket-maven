from flask import request
from RocketMaven.api.schemas import PortfolioEventSchema, PortfolioAssetHoldingSchema
from RocketMaven.models import PortfolioEvent, PortfolioAssetHolding
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate

import requests

YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=longName,shortName,regularMarketPrice"

def get_events(portfolio_id):
    schema = PortfolioEventSchema(many=True)
    query = PortfolioEvent.query.filter_by(portfolio_id=portfolio_id)

    assets = set(x.asset_id for x in query.all())
    for portfolio_asset in assets:
        asset, exchange = portfolio_asset.split(":")
        if asset == "VIRT":
            continue
        endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=".".join(asset, exchange))
        print(endpoint)
        try:
            response = requests.get(endpoint)
            print("TODO: update Asset")
            print(response.json())
        except:
            print("Could not update")
    return paginate(query, schema)


def get_holdings(portfolio_id):
    schema = PortfolioAssetHoldingSchema(many=True)
    query = PortfolioAssetHolding.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)

def create_event(portfolio_id):

    schema = PortfolioEventSchema()

    portfolio_event = schema.load(request.json)
    portfolio_event.portfolio_id = portfolio_id
    db.session.add(portfolio_event)
    db.session.commit()
    portfolio_event.update_portfolio_asset_holding()

    return (
        {
            "msg": "portfolio event created",
            "portfolio event": schema.dump(portfolio_event),
        },
        201,
    )
