from flask import request
from RocketMaven.api.schemas import PortfolioEventSchema, PortfolioAssetHoldingSchema
from RocketMaven.models import PortfolioEvent, PortfolioAssetHolding
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate

def get_events(portfolio_id):
    schema = PortfolioEventSchema(many=True)
    query = PortfolioEvent.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)

def get_holdings(portfolio_id):
    schema = PortfolioAssetHoldingSchema(many=True)
    query = PortfolioAssetHolding.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)


def create_event(portfolio_id):

    schema = PortfolioEventSchema()

    portfolio_event = schema.load(request.json)
    db.session.add(portfolio_event)
    db.session.commit()
    portfolio_event.update_portfolio_asset_holding()

    return {"msg": "portfolio event created", "portfolio event": schema.dump(portfolio_event)}, 201
