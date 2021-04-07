from flask import request
from RocketMaven.api.schemas import PortfolioSchema, PublicPortfolioSchema, AssetSchema
from RocketMaven.models import Portfolio, Asset, PortfolioEvent, PortfolioAssetHolding
from RocketMaven.extensions import db
from RocketMaven.services.PortfolioEventService import update_asset
from RocketMaven.commons.pagination import paginate
from flask_jwt_extended import get_jwt_identity
from RocketMaven.models import Investor
import sys
import collections


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


def get_all_portfolios(investor_id):
    schema = PortfolioSchema(many=True)

    query = Portfolio.query.filter_by(investor_id=investor_id)

    return paginate(query, schema)


def get_portfolios(investor_id):
    schema = PortfolioSchema(many=True)

    # Get the assets that are part of this portfolio
    assets = (
        db.session()
        .query(Asset)
        .join(PortfolioEvent)
        .join(Portfolio)
        .filter_by(deleted=False)
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


def get_report():
    schema = PortfolioSchema(many=True)

    if not "report_type" in request.json or not "portfolios" in request.json:
        return {"msg": "invalid report parameters!"}, 400

    portfolios = (
        db.session()
        .query(PortfolioAssetHolding)
        .join(Asset)
        .join(Portfolio)
        .filter_by(investor_id=get_jwt_identity())
        .filter(Portfolio.id.in_(request.json["portfolios"]))
    )

    if request.json["report_type"] == "Diversification":
        series_raw = collections.defaultdict(lambda: collections.defaultdict(int))
        drilldown_raw = collections.defaultdict(
            lambda: collections.defaultdict(lambda: collections.defaultdict(int))
        )
        total_normalise = collections.defaultdict(int)
        for m in portfolios.all():
            series_raw[m.portfolio_id][m.asset.industry] += (
                m.average_price * m.available_units
            )
            drilldown_raw[m.portfolio_id][m.asset.industry][m.asset.ticker_symbol] += (
                m.average_price * m.available_units
            )
            total_normalise[m.portfolio_id] += m.average_price * m.available_units

        series = []
        drilldown = {
            "series": [],
            "activeDataLabelStyle": {
                "textDecoration": "none",
                "fontStyle": "regular",
                "color": "white",
            },
        }

        col = 0.85
        row = 0.5
        spacing = 50
        width = 200

        for portfolio_id in series_raw:
            port_data = []
            if total_normalise[portfolio_id] == 0:
                continue
            for m in series_raw[portfolio_id]:
                if series_raw[portfolio_id][m] == 0:
                    continue
                port_data.append(
                    {
                        "name": m,
                        "drilldown": (m + str(portfolio_id)).replace(" ", "_"),
                        "y": (
                            series_raw[portfolio_id][m] / total_normalise[portfolio_id]
                        )
                        * 100,
                    }
                )
            series.append(
                {
                    "name": "Portfolio " + str(portfolio_id),
                    "colorByPoint": True,
                    "data": port_data,
                    "center": [
                        width * col + spacing * col,
                        width * row + spacing * (row - 1),
                    ],
                    "size": width,
                }
            )

            col += 1
            if col > 2:
                col = 0.85
                row += 1

        for portfolio_id in drilldown_raw:
            if total_normalise[portfolio_id] == 0:
                continue
            for m in drilldown_raw[portfolio_id]:
                if series_raw[portfolio_id][m] == 0:
                    continue
                port_data = []
                for n in drilldown_raw[portfolio_id][m]:
                    port_data.append(
                        [
                            n,
                            (
                                drilldown_raw[portfolio_id][m][n]
                                / series_raw[portfolio_id][m]
                            )
                            * 100,
                        ]
                    )
                drilldown["series"].append(
                    {
                        "name": m,
                        "id": (m + str(portfolio_id)).replace(" ", "_"),
                        "data": port_data,
                    }
                )
        return {"series": series, "drilldown": drilldown}, 200

    return True


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
            PortfolioAssetHolding, db.func.count(PortfolioAssetHolding.asset_id)
        )
        .group_by(PortfolioAssetHolding.asset_id)
        .order_by(db.func.max(PortfolioAssetHolding.asset_id).asc())
        .first()
    )
    holding = most_frequent_holding_result[0]
    asset = Asset.query.get_or_404(holding.asset_id)
    asset_schema = AssetSchema()
    portfolio_schema = PublicPortfolioSchema()
    return {
        "portfolio": portfolio_schema.dump(portfolio),
        "asset": asset_schema.dump(asset),
    }, 200
