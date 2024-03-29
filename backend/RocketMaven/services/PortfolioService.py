import collections
import datetime
import heapq
import json

import dateutil
from flask import request
from flask_jwt_extended import get_jwt_identity
from RocketMaven.api.schemas import AssetSchema, PortfolioSchema, PublicPortfolioSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import (
    Asset,
    CurrencyHistory,
    Portfolio,
    PortfolioAssetHolding,
    PortfolioEvent,
)
from RocketMaven.services import TimeSeriesService
from RocketMaven.services.AssetService import update_assets_price
from sqlalchemy import and_
from sqlalchemy.orm import aliased


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
    if request.args.get("deleted", "true") == "false":
        query = Portfolio.query.filter_by(investor_id=investor_id, deleted=False)
    else:
        query = Portfolio.query.filter_by(investor_id=investor_id)

    return paginate(query, schema)


def get_all_portfolios_with_holding_info(investor_id, ticker_symbol):
    """Get all investor's portfolios (including deleted)
    Returns:
        200 - paginated list of portfolios
    """
    if not get_jwt_identity() or investor_id == 0:
        return {"results": []}

    results = []

    try:
        holding_query = aliased(
            PortfolioAssetHolding,
            db.session.query(PortfolioAssetHolding)
            .filter(
                PortfolioAssetHolding.investor_id == get_jwt_identity(),
                PortfolioAssetHolding.asset_id == ticker_symbol,
            )
            .subquery(),
        )

        port_query = aliased(
            Portfolio,
            db.session.query(Portfolio)
            .filter(
                Portfolio.investor_id == get_jwt_identity(),
                Portfolio.deleted.is_(False),
            )
            .subquery(),
        )

        query = db.session.query(port_query, holding_query).outerjoin(
            holding_query, holding_query.portfolio_id == port_query.id
        )

        for m in query.all():
            current_result = {"id": m[0].id, "name": m[0].name, "holding": 0}

            if m[1]:
                current_result["holding"] = m[1].available_units

            results.append(current_result)

    except Exception as e:
        print(e)

    return {"results": results}


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

    update_status = update_assets_price(assets)
    if update_status[1] == 500:
        # Error updating an asset
        return update_status

    query = Portfolio.query.filter_by(investor_id=investor_id).filter_by(deleted=False)

    result_return = paginate(query, schema)
    for portfolio in result_return["results"]:
        portfolio["recommended"] = recommend_portfolio(
            portfolio["portfolio_asset_holding"]
        )

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

            # Get a summary of the total assets hold by each portfolio (by industry)
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

            # Map each industry to the total held
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

            # Map each industry and asset to the total held
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
            # Return the highcharts-compatible graph
            return {"series": series, "drilldown": drilldown}, 200
        except Exception as e:
            print(e)
            return {"msg": "error creating diversification report"}, 500

    if request.json["report_type"] == "Performance":

        portfolios = (
            db.session()
            .query(PortfolioEvent)
            .join(Portfolio)
            .filter_by(investor_id=get_jwt_identity())
            .filter(Portfolio.id.in_(request.json["portfolios"]))
        )
        currency = (
            db.session().query(CurrencyHistory).order_by(CurrencyHistory.date.asc())
        )

        any_event = portfolios.order_by(PortfolioEvent.event_date.asc()).first()

        if not any_event:
            return {"series": []}

        first_date_bounds = any_event.event_date
        last_date_bounds = datetime.datetime.now()
        last_date_bounds = datetime.datetime(
            last_date_bounds.year,
            last_date_bounds.month,
            last_date_bounds.day,
        )

        # portfolio_assets = set([])

        if (
            "date_range" in request.json
            and request.json["date_range"]
            and len(request.json["date_range"]) > 0
        ):
            date_range = request.json["date_range"]
            date_range = [
                dateutil.parser.parse(x).replace(tzinfo=None)
                + datetime.timedelta(days=1)
                for x in date_range
            ]
            # Ant design doesn't allow for filling only one side of the date range
            if len(date_range) == 2:
                first_date_bounds = max(date_range[0], first_date_bounds)
                last_date_bounds = min(date_range[1], last_date_bounds)
                portfolios = portfolios.filter(
                    and_(
                        PortfolioEvent.event_date >= date_range[0],
                        PortfolioEvent.event_date <= date_range[1],
                    )
                )
        currency = currency.filter(
            and_(
                CurrencyHistory.date >= first_date_bounds,
                CurrencyHistory.date <= last_date_bounds,
            )
        )

        # At this point, currency and portfolio event data should be cropped to the input date range

        # currency_reverse_map = {"CURRENCY1/CURRENCY2": {"YYYY-MM-DD": "value"}}
        currency_reverse_map = collections.defaultdict(
            lambda: collections.defaultdict(str)
        )

        # Cache the min/max of the assets on aggregate so that the graph data is called once
        # e.g. AAPL in Portfolios 1, 2, 3 would only grab the time series data once
        # ticker_date_min_max = {}

        # Challenge is normalising the data to match the user's events, the asset's price and the exchange rate.

        all_portfolio_events = portfolios.all()

        currency_pairs = set()

        def normalise_date(datetime_in):
            return (
                datetime.datetime(
                    datetime_in.year,
                    datetime_in.month,
                    datetime_in.day,
                ).timestamp()
                * 1000
            )

        # Reverse map currency data
        for m in currency.all():
            if m.value:
                currency_reverse_map[
                    str(m.currency_from.code) + "/" + str(m.currency_to.code)
                ][normalise_date(m.date)] = m.value

                currency_pairs.add(
                    str(m.currency_from.code) + "/" + str(m.currency_to.code)
                )

        last_currency = collections.defaultdict(float)

        timestamps = []
        days = 0
        final_date = last_date_bounds

        # Prefill the full date range of the chosen graphed data
        while (first_date_bounds + datetime.timedelta(days=days)) < final_date:
            tmp_current_date = first_date_bounds + datetime.timedelta(days=days)

            # Normalise to start of the day to make correlation much easier
            current_timestamp = normalise_date(tmp_current_date)

            # Fill exchange rate
            for n in currency_pairs:
                if current_timestamp in currency_reverse_map[n]:
                    last_currency[n] = currency_reverse_map[n][current_timestamp]
                else:
                    currency_reverse_map[n][current_timestamp] = last_currency[n]

            timestamps.append(current_timestamp)
            days += 1

        # last_realised = collections.defaultdict(float)
        # last_unrealised = collections.defaultdict(float)

        # Get time ranges for asset timeseries batch loading
        earliest_latest_for_asset = collections.defaultdict(list)
        for portfolio_event in all_portfolio_events:
            port_asset = portfolio_event.asset_id
            if not port_asset in earliest_latest_for_asset:  # noqa: E713
                earliest_latest_for_asset[port_asset] = [
                    portfolio_event.event_date - datetime.timedelta(days=1),
                    # portfolio_event.event_date + datetime.timedelta(days=1),
                    last_date_bounds,
                ]
            else:
                earliest_latest_for_asset[port_asset][0] = min(
                    earliest_latest_for_asset[port_asset][0],
                    portfolio_event.event_date,
                )
                # earliest_latest_for_asset[port_asset][1] = max(
                #     earliest_latest_for_asset[port_asset][1],
                #     portfolio_event.event_date,
                # )

        # Download the timeseries data that will be shared across all portfolios for the same assets
        asset_series_data = {}
        for asset_id, earliest_latest in earliest_latest_for_asset.items():
            time_data = TimeSeriesService.get_timeseries_data_advanced(
                asset_id,
                earliest_latest[0],
                earliest_latest[1],
                TimeSeriesService.TimeSeriesInterval.OneDay,
            )[0]

            # Could use the error code directly...
            if "msg" in time_data:
                time_data["results"] = []

            asset_series_data[asset_id] = {
                normalise_date(dateutil.parser.parse(x["datetime"])): x["close"]
                for x in time_data["results"]
            }

        asset_series_fill_last = collections.defaultdict(float)
        for timestamp in timestamps:
            for series_asset in asset_series_data:
                if timestamp in asset_series_data[series_asset]:
                    asset_series_fill_last[series_asset] = asset_series_data[
                        series_asset
                    ][timestamp]
                else:
                    asset_series_data[series_asset][timestamp] = asset_series_fill_last[
                        series_asset
                    ]

        # Performance is at the level of a portfolio, so need to aggregate all assets
        asset_realised_last = collections.defaultdict(
            lambda: collections.defaultdict(float)
        )
        asset_unrealised_last = collections.defaultdict(
            lambda: collections.defaultdict(float)
        )

        asset_realised_last_loose_map = collections.defaultdict(
            lambda: collections.defaultdict(dict)
        )
        asset_unrealised_last_loose_map = collections.defaultdict(
            lambda: collections.defaultdict(dict)
        )

        # Map asset to time data
        for portfolio_event in all_portfolio_events:

            # These values were all cached from the FIFO calculations
            portfolio_event_date = normalise_date(portfolio_event.event_date)

            if portfolio_event_date in timestamps:
                asset_unrealised_last_loose_map[portfolio_event.portfolio_id][
                    portfolio_event.asset_id
                ][portfolio_event_date] = portfolio_event.available_snapshot

                asset_realised_last_loose_map[portfolio_event.portfolio_id][
                    portfolio_event.asset_id
                ][portfolio_event_date] = portfolio_event.realised_snapshot

        # Fill in asset-level gaps, timestamps is in ascending order
        for timestamp in timestamps:
            for portfolios in asset_unrealised_last_loose_map:
                for asset in asset_unrealised_last_loose_map[portfolios]:
                    if (
                        timestamp
                        not in asset_unrealised_last_loose_map[portfolios][asset]
                    ):
                        # Fill if doesn't exist
                        asset_unrealised_last_loose_map[portfolios][asset][
                            timestamp
                        ] = asset_unrealised_last[portfolios][asset]
                        asset_realised_last_loose_map[portfolios][asset][
                            timestamp
                        ] = asset_realised_last[portfolios][asset]
                    else:
                        # Reverse fill if exists (for next fills)
                        asset_unrealised_last[portfolios][
                            asset
                        ] = asset_unrealised_last_loose_map[portfolios][asset][
                            timestamp
                        ]
                        asset_realised_last[portfolios][
                            asset
                        ] = asset_realised_last_loose_map[portfolios][asset][timestamp]

        # Here, portfolios is a list of all events within the date range.
        series_unmapped = collections.defaultdict(
            lambda: collections.defaultdict(float)
        )

        # Fill final time series
        for current_timestamp in timestamps:
            for m in request.json["portfolios"]:
                series_unmapped[m][current_timestamp] = 0

        for timestamp in timestamps:
            for portfolios in asset_unrealised_last_loose_map:
                for asset in asset_unrealised_last_loose_map[portfolios]:
                    series_unmapped[portfolios][timestamp] += (
                        asset_unrealised_last_loose_map[portfolios][asset][timestamp]
                        * asset_series_data[asset][timestamp]
                    )
                    series_unmapped[portfolios][
                        timestamp
                    ] += asset_realised_last_loose_map[portfolios][asset][timestamp]

        series = {x: list(y.items()) for x, y in series_unmapped.items()}

        name = "Performance of Portfolio "
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
        # Tax information is already cached / stored as part of the FIFO calculations

        portfolios = (
            db.session()
            .query(PortfolioEvent)
            .join(Portfolio)
            .filter_by(investor_id=get_jwt_identity())
            .filter(Portfolio.id.in_(request.json["portfolios"]))
            .order_by(PortfolioEvent.event_date.asc())
            .filter(PortfolioEvent.tax_full_snapshot.isnot(None))
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
            series[portfolio_event.portfolio_name].extend(
                json.loads(portfolio_event.tax_full_snapshot)
            )

        # Return the dictionary data to be mapped into a regular table
        return list(series.items())

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
        .filter(Portfolio.public_portfolio.is_(True), Portfolio.deleted.is_(False))
        .first()
    )
    portfolio = most_viewed_portfolio_result[0]

    # Order by most "used" holding
    most_frequent_holding_result = (
        db.session.query(
            PortfolioAssetHolding, db.func.count(PortfolioAssetHolding.asset_id)
        )
        .join(Portfolio)
        .filter(Portfolio.public_portfolio.is_(True), Portfolio.deleted.is_(False))
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
    if False:
        # Jin's original algorithm
        recommended = []
        for each in asset_holdings:
            portfolio_asset_industry = (
                Asset.query.filter_by(ticker_symbol=each["asset_id"]).first().industry
            )
            for asset in Asset.query.filter_by(
                industry=portfolio_asset_industry
            ).order_by(Asset.market_cap.desc()):
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

    if True:
        assets_to_display = 7

        # Maintain a maxheap
        recommended = []
        existing_assets = []
        total_value = 0
        for each in asset_holdings:
            existing_assets.append(each["asset_id"])
            total_value += each["average_price"] * each["available_units"]

        if total_value > 0:

            for each in asset_holdings:
                # Loop through assets in portfolio

                recommended_local = []

                if each["asset"]["market_cap"]:
                    portfolio_asset_industry = (
                        Asset.query.filter_by(ticker_symbol=each["asset_id"])
                        .first()
                        .industry
                    )

                    for asset in Asset.query.filter_by(
                        industry=portfolio_asset_industry
                    ):
                        # Assets in the same industry as the portfolio asset
                        if asset.ticker_symbol not in existing_assets:
                            # That has not already been added to the portfolio
                            # e.g. don't recommend ASX:CBA from ASX:NAB when ASX:CBA has already been added

                            # Lowest market cap difference becomes largest value due to negation
                            diff = (
                                -abs(each["asset"]["market_cap"] - asset.market_cap),
                                asset.ticker_symbol,
                            )

                            if len(recommended_local) < assets_to_display:
                                heapq.heappush(recommended_local, diff)
                            else:
                                heapq.heappushpop(recommended_local, diff)

                # Weigh listed recommendations based on the asset's share of the portfolio
                current_asset_portion = (
                    each["average_price"] * each["available_units"] / total_value
                )
                recommended_local.reverse()
                recommended.extend(
                    recommended_local[
                        : max(
                            int(assets_to_display * current_asset_portion),
                            1,
                        )
                    ]
                )

        return [[x[1], x[1]] for x in recommended]
