from flask import request
from RocketMaven.api.schemas import PortfolioSchema
from RocketMaven.models import Portfolio
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate


def get_portfolio(portfolio_id):
    schema = PortfolioSchema()
    data = Portfolio.query.get_or_404(portfolio_id)
    return {"portfolio": schema.dump(data)}


def update_portfolio(portfolio_id):
    schema = PortfolioSchema(partial=True)

    portfolio = Portfolio.query.get_or_404(portfolio_id)
    data = schema.load(request.json, instance=portfolio)

    db.session.commit()

    return {"msg": "portfolio updated", "portfolio": schema.dump(data)}


def get_portfolios(investor_id):
    schema = PortfolioSchema(many=True)
    query = Portfolio.query.filter_by(investor_id=investor_id)
    return paginate(query, schema)


def create_portfolio(investor_id):

    schema = PortfolioSchema()
    portfolio = schema.load(request.json)
    portfolio.investor_id = investor_id

    db.session.add(portfolio)
    db.session.commit()

    return {"msg": "portfolio created", "portfolio": schema.dump(portfolio)}, 201
