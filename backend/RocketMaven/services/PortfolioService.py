from flask import request
from RocketMaven.api.schemas import PortfolioSchema, PublicPortfolioSchema
from RocketMaven.models import Portfolio, Asset, PortfolioEvent
from RocketMaven.extensions import db
from RocketMaven.services.PortfolioEventService import update_asset
from RocketMaven.commons.pagination import paginate
from flask_jwt_extended import get_jwt_identity
from RocketMaven.models import Investor
import sys


def get_portfolio(portfolio_id):
    schema = PortfolioSchema()
    data = Portfolio.query.get_or_404(portfolio_id)
    return {"portfolio": schema.dump(data)}

def get_public_portfolio(portfolio_id):
    schema = PublicPortfolioSchema()
    data = Portfolio.query.get_or_404(portfolio_id)
    if data.public_portfolio or data.investor_id == get_jwt_identity():
        return {"portfolio": schema.dump(data)}
    else:
        return {"msg": "Portfolio is private"}, 401

def update_portfolio(portfolio_id):
    schema = PortfolioSchema(partial=True)

    portfolio = Portfolio.query.get_or_404(portfolio_id)
    data = schema.load(request.json, instance=portfolio)

    db.session.commit()

    return {"msg": "portfolio updated", "portfolio": schema.dump(data)}

def delete_portfolio(portfolio_id):
    portfolio = Portfolio.query.get_or_404(portfolio_id)
    portfolio.deleted = True

    db.session.commit()

    return {"msg": "portfolio deleted"}

def get_portfolios(investor_id):
    schema = PortfolioSchema(many=True)
    
    # Get the assets that are part of this portfolio
    assets = (
        db.session()
        .query(Asset)
        .join(PortfolioEvent)
        .join(Portfolio)
        .filter_by(investor_id=investor_id)        
        .distinct(PortfolioEvent.asset_id)
        .all()
    )
    
    # Set to False when debugging to reduce Yahoo API calls
    if True:
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

    query = Portfolio.query.filter_by(investor_id=investor_id).filter_by(deleted=False)

    return paginate(query, schema)


def create_portfolio(investor_id):

    schema = PortfolioSchema()
    portfolio = schema.load(request.json)
    portfolio.investor_id = investor_id

    db.session.add(portfolio)
    db.session.commit()

    return {"msg": "portfolio created", "portfolio": schema.dump(portfolio)}, 201
