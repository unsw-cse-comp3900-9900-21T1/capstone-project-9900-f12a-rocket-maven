from flask import Flask, send_from_directory
from RocketMaven import api
from RocketMaven import auth
from RocketMaven.extensions import apispec
from RocketMaven.extensions import db
from RocketMaven.extensions import jwt
from RocketMaven.extensions import migrate
from flask import request
import datetime

import sys

# https://github.com/pallets/werkzeug/issues/1832
if sys.platform.lower() == "win32":
    import os

    os.system("color")


def create_app(testing=False):
    """Application factory, used to create application"""

    app = Flask("RocketMaven", static_folder=None)
    app.config.from_object("RocketMaven.config")

    if testing is True:
        app.config["TESTING"] = True
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=60 * 24 * 30)

    configure_extensions(app)
    configure_apispec(app)
    register_blueprints(app)

    # http://stackoverflow.com/questions/30620276/flask-and-react-routing/50660437#50660437
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def react_static(path):
        print(path, os.path.join(app.root_path + "/web/", path))
        if path != "" and os.path.exists(os.path.join(app.root_path + "/web/", path)):
            return send_from_directory(app.root_path + "/web/", path)
        else:
            return send_from_directory(app.root_path + "/web/", "index.html")

    # https://stackoverflow.com/questions/9513072/more-than-one-static-path-in-local-flask-instance
    @app.route("/swagger/<path:filename>")
    def swagger_static(filename):
        return send_from_directory(app.root_path + "/swagger/", filename)

    # def custom_index():
    #     return "<a href='swagger-ui'>Swagger UI</a>", 200

    @app.route("/pw_reset", methods=["GET", "POST"])
    def pw_reset():
        key = request.args.get("key")
        print(key)
        return (
            """
            <form action="/api/v1/pw_reset" method="post">
              <label>Enter new password:</label>
              <input type="text" id="password" name="password"><br><br>
              <label>Repeat your password:</label>
              <input type="text" id="confirmation" name="confirmation"><br><br>
              <input type="submit" value="Submit">
              <input type="hidden" id="evc" name="evc" value="""
            + key
            + """>
            </form>
        """
        )

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
