import atexit
import datetime
import os
import sys

from apscheduler.schedulers.background import BackgroundScheduler as BackgroundScheduler
from dotenv import load_dotenv
from flask import Flask, send_from_directory

from RocketMaven import api, auth
from RocketMaven.extensions import apispec, db, jwt, migrate
from RocketMaven.services.WatchlistService import send_watchlist_email

load_dotenv(os.path.join(os.path.dirname(__file__), "settings.env"))

# https://github.com/pallets/werkzeug/issues/1832
if sys.platform.lower() == "win32":
    import os

    os.system("color")


class WatchlistBackgroundNotify:
    def run_notify(self):
        with self.app.app_context():
            send_watchlist_email()

    def __init__(self, app):
        self.app = app


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

    # https://stackoverflow.com/questions/14874782/apscheduler-in-flask-executes-twice/25519547#25519547
    if (
        not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true"
    ) and os.environ.get("WATCHLIST_NOTIFICATIONS_ALLOWED") == "true":
        try:
            app.sched = BackgroundScheduler(daemon=True)
            new_notify = WatchlistBackgroundNotify(app)
            app.sched.add_job(
                lambda: new_notify.run_notify(),
                "interval",
                seconds=int(os.environ.get("WATCHLIST_NOTIFICATIONS_CHECK", 10)),
            )
            app.sched.start()
            atexit.register(lambda: app.sched.shutdown())
        except Exception as e:
            print(f"Error encountered running watchlist notification server: {str(e)}")

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
