from flask import Blueprint, current_app, jsonify
from flask_restful import Api
from marshmallow import ValidationError
from RocketMaven.extensions import apispec
from RocketMaven.api.resources import UserResource, UserList, Time, LoginStub, PortfolioStub
from RocketMaven.api.schemas import UserSchema


blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(blueprint)

# Stub endpoints for front end testing
api.add_resource(Time, "/get-time", endpoint="current_time")
api.add_resource(LoginStub, "/login-stub", endpoint="login_stub")
api.add_resource(PortfolioStub, "/portfolio-stub", endpoint="portfolio_stub")


api.add_resource(UserResource, "/users/<int:user_id>", endpoint="user_by_id")
api.add_resource(UserList, "/users", endpoint="users")


@blueprint.before_app_first_request
def register_views():
    apispec.spec.components.schema("UserSchema", schema=UserSchema)
    apispec.spec.path(view=UserResource, app=current_app)
    apispec.spec.path(view=UserList, app=current_app)

    # Stub endpoints for front end testing 
    apispec.spec.path(view=Time, app=current_app)
    apispec.spec.path(view=LoginStub, app=current_app)
    apispec.spec.path(view=PortfolioStub, app=current_app)


@blueprint.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    """Return json error for marshmallow validation errors.

    This will avoid having to try/catch ValidationErrors in all endpoints, returning
    correct JSON response with associated HTTP 400 Status (https://tools.ietf.org/html/rfc7231#section-6.5.1)
    """
    return jsonify(e.messages), 400
