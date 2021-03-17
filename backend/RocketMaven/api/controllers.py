from flask import Blueprint, current_app, jsonify
from flask_restful import Api
from marshmallow import ValidationError

from RocketMaven.extensions import apispec
from RocketMaven.api.resources import (
    AssetResource,
    AssetSearchResource,
    InvestorResource,
    InvestorList,
    PortfolioResource,
    PortfolioList,
    Time,
    LoginStub,
    PortfolioStub,
    PortfolioEventList,
    PortfolioAssetHoldingList,
    Iforgot,
    Pw_reset,
)
from RocketMaven.api.schemas import (
    AssetSchema,
    InvestorSchema,
    PortfolioSchema,
    PortfolioEventSchema,
    PortfolioAssetHoldingSchema
)


blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(blueprint)

# Stub endpoints for front end testing
api.add_resource(Time, "/get-time", endpoint="current_time")
api.add_resource(LoginStub, "/login-stub", endpoint="login_stub")
api.add_resource(PortfolioStub, "/portfolio-stub", endpoint="portfolio_stub")


api.add_resource(InvestorResource, "/investors/<int:investor_id>", endpoint="investor_by_id")
api.add_resource(InvestorList, "/investors", endpoint="investors")

api.add_resource(
    AssetSearchResource,
    "/assets/search",
    endpoint="assert_search"
)

api.add_resource(
    AssetResource,
    "/assets/<string:ticker_symbol>",
    endpoint="asset_by_ticker"
)

api.add_resource(
    PortfolioEventList, 
    "/portfolios/<int:portfolio_id>/history",
    endpoint="portfolio_event_by_id",
)

api.add_resource(
    PortfolioAssetHoldingList, 
    "/portfolios/<int:portfolio_id>/holdings",
    endpoint="asset_holding_by_id",
)

api.add_resource(
    PortfolioResource,
    "/investors/<int:investor_id>/portfolios/<int:portfolio_id>",
    endpoint="portfolio_by_id",
)
api.add_resource(
    PortfolioList, "/investors/<int:investor_id>/portfolios", endpoint="portfolios"
)

api.add_resource(
	Iforgot, "/iforgot", endpoint="iforgot"
)

api.add_resource(
    Pw_reset, "/pw_reset", endpoint="pw_reset"
)


@blueprint.before_app_first_request
def register_controllers():
    apispec.spec.components.schema('AssetSchema', schema=AssetSchema)
    apispec.spec.path(view=AssetResource, app=current_app, api=api)
    apispec.spec.path(view=AssetSearchResource, app=current_app, api=api)
    
    apispec.spec.components.schema("InvestorSchema", schema=InvestorSchema)
    apispec.spec.path(view=InvestorResource, app=current_app, api=api)
    apispec.spec.path(view=InvestorList, app=current_app, api=api)

    apispec.spec.components.schema("PortfolioSchema", schema=PortfolioSchema)
    apispec.spec.path(view=PortfolioResource, app=current_app, api=api)
    apispec.spec.path(view=PortfolioList, app=current_app, api=api)
    
    apispec.spec.components.schema("PortfolioEventSchema", schema=PortfolioEventSchema)
    apispec.spec.path(view=PortfolioEventList, app=current_app, api=api)
    
    apispec.spec.components.schema("PortfolioAssetHoldingSchema", schema=PortfolioAssetHoldingSchema)
    apispec.spec.path(view=PortfolioAssetHoldingList, app=current_app, api=api)

    apispec.spec.path(view=Time, app=current_app, api=api)
    apispec.spec.path(view=LoginStub, app=current_app, api=api)
    apispec.spec.path(view=PortfolioStub, app=current_app, api=api)

    apispec.spec.path(view=Iforgot, app=current_app, api=api)
    
    apispec.spec.path(view=Pw_reset, app=current_app, api=api)



@blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    """Return json error for marshmallow validation errors.

    This will avoid having to try/catch ValidationErrors in all endpoints, returning
    correct JSON response with associated HTTP 400 Status (https://tools.ietf.org/html/rfc7231#section-6.5.1)
    """
    return jsonify(e.messages), 400
