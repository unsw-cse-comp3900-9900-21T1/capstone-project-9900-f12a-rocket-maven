from flask import Flask
from RocketMaven import api
from RocketMaven import auth
from RocketMaven.extensions import apispec
from RocketMaven.extensions import db
from RocketMaven.extensions import jwt
from RocketMaven.extensions import migrate

import sys

# https://github.com/pallets/werkzeug/issues/1832
if sys.platform.lower() == "win32":
    import os

    os.system("color")


def create_app(testing=False):
    """Application factory, used to create application"""
    app = Flask("RocketMaven")
    app.config.from_object("RocketMaven.config")

    if testing is True:
        app.config["TESTING"] = True

    configure_extensions(app)
    configure_apispec(app)
    register_blueprints(app)

    return app


def configure_extensions(app):
    """configure flask extensions"""
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)


def configure_apispec(app):
    """Configure APISpec for swagger support"""
    apispec.init_app(app, security=[{"jwt": []}])
    apispec.spec.components.security_scheme(
        "jwt", {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
    )
    apispec.spec.components.schema(
        "PaginatedResult",
        {
            "properties": {
                "total": {"type": "integer"},
                "pages": {"type": "integer"},
                "next": {"type": "string"},
                "prev": {"type": "string"},
            }
        },
    )


def register_blueprints(app):
    """register all blueprints for application"""
    app.register_blueprint(auth.controllers.blueprint)
    app.register_blueprint(api.controllers.blueprint)
