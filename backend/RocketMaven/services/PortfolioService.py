from flask import request
from RocketMaven.api.schemas import PortfolioSchema, PublicPortfolioSchema, AssetSchema
from RocketMaven.models import Portfolio, Asset, PortfolioEvent, PortfolioAssetHolding
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
        data.view_count += 1
        db.session.commit()
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

def get_top_additions():
    # View count of portfolio
    most_viewed_portfolio_result = (
        db.session.query(Portfolio, db.func.max(Portfolio.view_count))
        .filter(Portfolio.public_portfolio == True)
        .first()
    )
    portfolio = most_viewed_portfolio_result[0]

    # Order by most "used" holding
    most_frequent_holding_result = (
        db.session.query(
            PortfolioAssetHolding,
            db.func.count(PortfolioAssetHolding.asset_id)
        )
        .group_by(PortfolioAssetHolding.asset_id)
        .order_by(db.func.max(PortfolioAssetHolding.asset_id).asc())
        .first()
    )
    holding = most_frequent_holding_result[0]
    asset = Asset.query.get_or_404(holding.asset_id)
    asset_schema = AssetSchema()
    portfolio_schema = PublicPortfolioSchema()
    return {"portfolio": portfolio_schema.dump(portfolio), "asset": asset_schema.dump(asset)}, 200
