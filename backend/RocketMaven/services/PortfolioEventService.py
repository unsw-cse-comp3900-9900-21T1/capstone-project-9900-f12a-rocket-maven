from flask import request
from RocketMaven.api.schemas import PortfolioEventSchema
from RocketMaven.models import PortfolioEvent
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate

def get_events(investor_id, portfolio_id):
    schema = PortfolioEventSchema(many=True)
    query = PortfolioEvent.query.filter_by(portfolio_id=portfolio_id)
    return paginate(query, schema)


def create_event(investor_id, portfolio_id):

    schema = PortfolioEventSchema()
    print(request.json)
    portfolio = schema.load(request.json)
    #portfolio.investor_id = investor_id

    db.session.add(portfolio)
    db.session.commit()

    return {"msg": "portfolio event created", "portfolio event": schema.dump(portfolio)}, 201
