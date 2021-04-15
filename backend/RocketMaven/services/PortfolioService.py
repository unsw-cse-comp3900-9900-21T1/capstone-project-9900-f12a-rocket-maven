import collections

from flask import request
from flask_jwt_extended import get_jwt_identity
from RocketMaven.api.schemas import AssetSchema, PortfolioSchema, PublicPortfolioSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import Asset, Portfolio, PortfolioAssetHolding, PortfolioEvent
from RocketMaven.services.PortfolioEventService import update_asset
from sqlalchemy import and_
import json


def get_portfolio(portfolio_id):
    """Get the portfolio matching the given portfolio id
    Returns:
        200 - portfolio
        404 - portfolio not found
    """
    schema = PortfolioSchema()
    data = Portfolio.query.get_or_404(portfolio_id)
    return {"portfolio": schema.dump(data)}


def get_public_portfolio(portfolio_id):
    """Get the public portfolio matching the given portfolio id
    Returns:
        200 - portfolio
        401 - portfolio is not private
        404 - portfolio not found
    """
    schema = PublicPortfolioSchema()
    data = Portfolio.query.get_or_404(portfolio_id)
    if data.public_portfolio or data.investor_id == get_jwt_identity():
        data.view_count += 1
        db.session.commit()
        return {"portfolio": schema.dump(data)}
    else:
        return {"msg": "Portfolio is private"}, 401


def update_portfolio(portfolio_id):
    """Update the portfolio matching the given portfolio id
    Returns:
        200 - portfolio updated
        404 - portfolio not found
    """
    schema = PortfolioSchema(partial=True)

    portfolio = Portfolio.query.get_or_404(portfolio_id)
    data = schema.load(request.json, instance=portfolio)

    db.session.commit()

    return {"msg": "Portfolio Updated", "portfolio": schema.dump(data)}


def delete_portfolio(portfolio_id):
    """Delete the given portfolio from the system
    Returns:
        200 - portfolio deleted (marked as deleted only)
        404 - portfolio not found
    """
    portfolio = Portfolio.query.get_or_404(portfolio_id)
    portfolio.deleted = True

    db.session.commit()

    return {"msg": "Portfolio Deleted"}


def get_all_portfolios(investor_id):
    """Get all investor's portfolios (including deleted)
    Returns:
        200 - paginated list of portfolios
    """
    if not get_jwt_identity() or investor_id == 0:
        return {"results": []}
    schema = PortfolioSchema(many=True)

    query = Portfolio.query.filter_by(investor_id=investor_id)

    return paginate(query, schema)


def get_portfolios(investor_id):
    """Get an investor's active portfolios.
    Triggers a price update on assets within the portfolios
    Returns:
        200 - paginated list of portoflios
        500 - error updating asset price
    """
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

    result_return = paginate(query, schema)
    for portfolio in result_return["results"]:
        portfolio["recommended"] = recommend_portfolio(
            portfolio["portfolio_asset_holding"]
        )

    print(result_return)

    return result_return


def get_report():
    """Get report data
    Returns:
        200 - report data ok
        400 - invalid report parameters
        500 - error generating report data
    """

    if "report_type" not in request.json or "portfolios" not in request.json:
        return {"msg": "invalid report parameters!"}, 400

    if request.json["report_type"] == "Diversification":
        try:
            portfolios = (
                db.session()
                .query(PortfolioAssetHolding)
                .join(Asset)
                .join(Portfolio)
                .filter_by(investor_id=get_jwt_identity())
                .filter(Portfolio.id.in_(request.json["portfolios"]))
            )
            series_raw = collections.defaultdict(lambda: collections.defaultdict(int))
            drilldown_raw = collections.defaultdict(
                lambda: collections.defaultdict(lambda: collections.defaultdict(int))
            )
            total_normalise = collections.defaultdict(int)
            for m in portfolios.all():
                series_raw[m.portfolio_id][m.asset.industry] += (
                    m.average_price * m.available_units
                )
                drilldown_raw[m.portfolio_id][m.asset.industry][
                    m.asset.ticker_symbol
                ] += (m.average_price * m.available_units)
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
                                series_raw[portfolio_id][m]
                                / total_normalise[portfolio_id]
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
        except Exception as e:
            print(e)
            return {"msg": "error creating diversification report"}, 500

    if request.json["report_type"] == "Realised":

        portfolios = (
            db.session()
            .query(PortfolioEvent)
            .join(Portfolio)
            .filter_by(investor_id=get_jwt_identity())
            .filter(Portfolio.id.in_(request.json["portfolios"]))
            .order_by(PortfolioEvent.event_date.asc())
        )

        if "date_range" in request.json:
            date_range = request.json["date_range"]
            if len(date_range) == 2:
                portfolios = portfolios.filter(
                    and_(
                        PortfolioEvent.event_date >= date_range[0],
                        PortfolioEvent.event_date <= date_range[1],
                    )
                )

        series = collections.defaultdict(list)

        for portfolio_event in portfolios.all():
            print(portfolio_event.event_date.timestamp())
            series[portfolio_event.portfolio_id].append(
                [
                    int(portfolio_event.event_date.timestamp()) * 1000,
                    portfolio_event.realised_snapshot,
                ]
            )

        name = "Realised Gains/Losses for Portfolio "
        return {
            "series": [
                {
                    "name": name + str(x[0]),
                    "id": "realised-" + str(x[0]).replace(" ", "_"),
                    "data": x[1],
                }
                for x in series.items()
            ]
        }
    if request.json["report_type"] == "Tax":

        portfolios = (
            db.session()
            .query(PortfolioEvent)
            .join(Portfolio)
            .filter_by(investor_id=get_jwt_identity())
            .filter(Portfolio.id.in_(request.json["portfolios"]))
            .order_by(PortfolioEvent.event_date.asc())
        )

        if "date_range" in request.json:
            date_range = request.json["date_range"]
            if len(date_range) == 2:
                portfolios = portfolios.filter(
                    and_(
                        PortfolioEvent.event_date >= date_range[0],
                        PortfolioEvent.event_date <= date_range[1],
                    )
                )

        series = collections.defaultdict(list)

        for portfolio_event in portfolios.all():
            series[portfolio_event.portfolio_id].append(
                [
                    int(portfolio_event.event_date.timestamp()) * 1000,
                    portfolio_event.tax_snapshot,
                ]
            )

        name = "Taxes for Portfolio "
        return {
            "series": [
                {
                    "name": name + str(x[0]),
                    "id": "realised-" + str(x[0]).replace(" ", "_"),
                    "data": x[1],
                }
                for x in series.items()
            ]
        }

    return True


def create_portfolio(investor_id):
    """Create a new portfolio for the investor
    Returns:
        200 - portfolio created
        400 - cannot create portfolio for another user
    """
    if not get_jwt_identity() == investor_id:
        return {"msg": "Cannot create portfolio for another user!"}, 400

    schema = PortfolioSchema()

    if (
        "competition_portfolio" in request.json
        and request.json["competition_portfolio"]
        and not request.json["competition_portfolio"] == "0"
    ):
        portfolios = (
            db.session()
            .query(Portfolio)
            .filter_by(
                investor_id=investor_id, competition_portfolio=True, deleted=False
            )
            .count()
        )

        if portfolios > 1:
            return {
                "msg": "An investor cannot create more than 2 competition portfolios!"
            }, 400

        request.json["currency"] = "USD"
        request.json["tax_residency"] = "AU"

    portfolio = schema.load(request.json)
    portfolio.investor_id = investor_id

    db.session.add(portfolio)
    db.session.commit()

    return {"msg": "portfolio created", "portfolio": schema.dump(portfolio)}, 201


def get_top_additions():
    # View count of portfolio

    # https://stackoverflow.com/questions/18998010/flake8-complains-on-boolean-comparison-in-filter-clause
    most_viewed_portfolio_result = (
        db.session.query(Portfolio, db.func.max(Portfolio.view_count))
        # TODO(Jude): Find why this broke all of a sudden - It looked like it was working fine before
        # It seems to me that we would only want to show public portfolios
        .filter(
            Portfolio.public_portfolio.is_(True), Portfolio.deleted.is_(False)
        ).first()
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
    if most_frequent_holding_result is None:
        return {"msg": "No most frequent holding result"}, 404

    holding = most_frequent_holding_result[0]
    asset = Asset.query.get_or_404(holding.asset_id)
    asset_schema = AssetSchema()
    portfolio_schema = PublicPortfolioSchema()
    return {
        "portfolio": portfolio_schema.dump(portfolio),
        "asset": asset_schema.dump(asset),
    }, 200


def recommend_portfolio(asset_holdings):
    recommended = []
    for each in asset_holdings:
        portfolio_asset_industry = (
            Asset.query.filter_by(ticker_symbol=each["asset_id"]).first().industry
        )
        for asset in Asset.query.filter_by(industry=portfolio_asset_industry).order_by(
            Asset.market_cap.desc()
        ):
            if not asset.asset_additional:
                continue
            else:
                price = asset.current_price
                asset_additional = json.loads(asset.asset_additional)
                fiftyDayAverageChange = float(
                    asset_additional["fiftyDayAverageChange"]["raw"]
                )
                twoHundredDayAverageChange = float(
                    asset_additional["twoHundredDayAverageChange"]["raw"]
                )

                diff = fiftyDayAverageChange - twoHundredDayAverageChange

                if diff > 0 and price > diff:
                    recommended.append([asset.ticker_symbol, asset.name])
                    break

        if len(recommended) >= 3:
            return recommended

    # if no asset_holding
    if not recommended:
        asset = Asset.query.order_by(Asset.market_cap.desc()).first()
        recommended.append([asset.ticker_symbol, asset.name])
        return recommended
    return recommended
