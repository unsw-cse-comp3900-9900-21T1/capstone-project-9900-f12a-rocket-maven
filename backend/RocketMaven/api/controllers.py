from flask import Blueprint, current_app, jsonify
from flask_restful import Api
from marshmallow import ValidationError

from RocketMaven.extensions import apispec
from RocketMaven.api.resources import (
    AssetResource,
    AssetPriceResource,
    AssetSearchResource,
    PortfolioAssetSearchResource,
    TimeSeriesResource,
    AdvancedTimeSeriesResource,
    DailyTimeSeriesResource,
    WeeklyTimeSeriesResource,
    MonthlyTimeSeriesResource,
    YearlyTimeSeriesResource,
    InvestorResource,
    InvestorList,
    PortfolioResource,
    PublicPortfolioResource,
    PortfolioList,
    PortfolioListAll,
    PortfolioEventList,
    PortfolioAssetHoldingList,
    Report,
    Iforgot,
    Pw_reset,
    TopAdditions,
    LeaderboardList,
    WatchAsset,
    WatchList,
    Explore,
    # Recommend,
)
from RocketMaven.api.schemas import (
    AssetSchema,
    InvestorSchema,
    PortfolioSchema,
    PortfolioEventSchema,
    PortfolioAssetHoldingSchema,
    LeaderboardSchema,
)


blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(blueprint)

api.add_resource(Explore, "/explore", endpoint="explore")

api.add_resource(
    InvestorResource, "/investors/<int:investor_id>", endpoint="investor_by_id"
)
api.add_resource(InvestorList, "/investors", endpoint="investors")

api.add_resource(AssetSearchResource, "/assets/search", endpoint="assert_search")
api.add_resource(
    PortfolioAssetSearchResource,
    "/assets/search/<int:portfolio_id>",
    endpoint="user_assert_search",
)

api.add_resource(
    AssetResource, "/assets/<string:ticker_symbol>", endpoint="asset_by_ticker"
)

api.add_resource(
    AssetPriceResource,
    "/assets/<string:ticker_symbol>/price",
    endpoint="asset_price_by_ticker",
)

api.add_resource(
    PortfolioEventList,
    "/portfolios/<int:portfolio_id>/history",
    endpoint="portfolio_event_by_id",
)

api.add_resource(
    LeaderboardList,
    "/leaderboard",
    endpoint="leaderboard",
)

api.add_resource(
    TopAdditions,
    "/top_additions",
    endpoint="top_additions",
)

api.add_resource(
    PortfolioAssetHoldingList,
    "/portfolios/<int:portfolio_id>/holdings",
    endpoint="asset_holding_by_id",
)

api.add_resource(
    PortfolioResource,
    "/portfolios/<int:portfolio_id>",
    endpoint="portfolio_by_id",
)

api.add_resource(
    PublicPortfolioResource,
    "/public-portfolios/<int:portfolio_id>",
    endpoint="public_portfolio_by_id",
)

api.add_resource(
    PortfolioList, "/investors/<int:investor_id>/portfolios", endpoint="portfolios"
)

api.add_resource(
    PortfolioListAll,
    "/investors/<int:investor_id>/all_portfolios",
    endpoint="all_portfolios",
)

api.add_resource(WatchList, "/watchlist", endpoint="watchlist")

api.add_resource(
    WatchAsset, "/watchlist/<string:ticker_symbol>", endpoint="watchlist_update"
)

api.add_resource(Report, "/report", endpoint="report")


api.add_resource(Iforgot, "/iforgot", endpoint="iforgot")

api.add_resource(Pw_reset, "/pw_reset", endpoint="pw_reset")

api.add_resource(
    TimeSeriesResource, "/chart/<string:ticker_symbol>/<string:range>", endpoint="chart"
)
api.add_resource(
    AdvancedTimeSeriesResource,
    "/chart/advanced/<string:ticker_symbol>",
    endpoint="advanced_chart",
)
api.add_resource(
    DailyTimeSeriesResource,
    "/chart/daily/<string:ticker_symbol>",
    endpoint="chart_daily",
)
api.add_resource(
    WeeklyTimeSeriesResource,
    "/chart/weekly/<string:ticker_symbol>",
    endpoint="chart_weekly",
)
api.add_resource(
    MonthlyTimeSeriesResource,
    "/chart/monthly/<string:ticker_symbol>",
    endpoint="chart_monthly",
)
api.add_resource(
    YearlyTimeSeriesResource,
    "/chart/yearly/<string:ticker_symbol>",
    endpoint="chart_yearly",
)

# api.add_resource(Recommend,
#     "",
#     endpoint=)


@blueprint.before_app_first_request
def register_controllers():
    apispec.spec.components.schema("AssetSchema", schema=AssetSchema)

    apispec.spec.path(view=Explore, app=current_app, api=api)

    apispec.spec.path(view=AssetResource, app=current_app, api=api)
    apispec.spec.path(view=AssetPriceResource, app=current_app, api=api)

    apispec.spec.path(view=AssetSearchResource, app=current_app, api=api)
    apispec.spec.path(view=PortfolioAssetSearchResource, app=current_app, api=api)

    apispec.spec.components.schema("InvestorSchema", schema=InvestorSchema)
    apispec.spec.path(view=InvestorResource, app=current_app, api=api)
    apispec.spec.path(view=InvestorList, app=current_app, api=api)

    apispec.spec.components.schema("PortfolioSchema", schema=PortfolioSchema)
    apispec.spec.path(view=PublicPortfolioResource, app=current_app, api=api)
    apispec.spec.path(view=PortfolioResource, app=current_app, api=api)
    apispec.spec.path(view=PortfolioList, app=current_app, api=api)
    apispec.spec.path(view=PortfolioListAll, app=current_app, api=api)

    apispec.spec.path(view=Report, app=current_app, api=api)

    apispec.spec.path(view=TopAdditions, app=current_app, api=api)

    apispec.spec.components.schema("PortfolioEventSchema", schema=PortfolioEventSchema)
    apispec.spec.path(view=PortfolioEventList, app=current_app, api=api)

    # apispec.spec.components.schema(
    #     "PortfolioAssetHoldingSchema", schema=PortfolioAssetHoldingSchema
    # )

    apispec.spec.path(view=PortfolioAssetHoldingList, app=current_app, api=api)

    apispec.spec.components.schema("LeaderboardSchema", schema=LeaderboardSchema)
    apispec.spec.path(view=LeaderboardList, app=current_app, api=api)

    apispec.spec.path(view=TimeSeriesResource, app=current_app, api=api)
    apispec.spec.path(view=AdvancedTimeSeriesResource, app=current_app, api=api)
    apispec.spec.path(view=DailyTimeSeriesResource, app=current_app, api=api)
    apispec.spec.path(view=WeeklyTimeSeriesResource, app=current_app, api=api)
    apispec.spec.path(view=MonthlyTimeSeriesResource, app=current_app, api=api)
    apispec.spec.path(view=YearlyTimeSeriesResource, app=current_app, api=api)

    apispec.spec.path(view=WatchList, app=current_app, api=api)
    apispec.spec.path(view=WatchAsset, app=current_app, api=api)
    apispec.spec.path(view=Iforgot, app=current_app, api=api)

    apispec.spec.path(view=Pw_reset, app=current_app, api=api)

    # apispec.spec.path(view=Recommend, app=current_app, api=api)


@blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    """Return json error for marshmallow validation errors.

    This will avoid having to try/catch ValidationErrors in all endpoints, returning
    correct JSON response with associated HTTP 400 Status (https://tools.ietf.org/html/rfc7231#section-6.5.1)
    """
    return jsonify(e.messages), 400
