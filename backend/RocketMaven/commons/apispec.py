import logging

import yaml
from apispec_webframeworks.flask import FlaskPlugin
from flask import Blueprint, jsonify, render_template

from apispec import APISpec, yaml_utils
from apispec.exceptions import APISpecError
from apispec.ext.marshmallow import MarshmallowPlugin


# Taken from: apispec_flask_restful
def parse_method(method, resource, operations):
    docstring = getattr(resource, method.lower()).__doc__
    if docstring:
        try:
            operation = yaml_utils.load_yaml_from_docstring(docstring)
        except yaml.YAMLError:
            operation = None
        if not operation:
            logging.getLogger(__name__).warning(
                "Cannot load docstring for {}/{}".format(resource, method)
            )
        operations[method.lower()] = operation or dict()


# Taken from: apispec_flask_restful
def parse_operations(resource, operations):
    """Parse operations for each method in a flask-restful resource"""

    if hasattr(resource, "methods"):

        for method in resource.methods:
            parse_method(method, resource, operations)


class FlaskRestfulPlugin(FlaskPlugin):
    """Small plugin override to handle flask-restful resources"""

    @staticmethod
    def _rule_for_view(view, app=None):

        view_funcs = app.view_functions

        endpoint = None

        for ept, view_func in view_funcs.items():

            if hasattr(view_func, "view_class"):
                view_func = view_func.view_class

            if view_func == view:
                endpoint = ept

        if not endpoint:
            raise APISpecError("Could not find endpoint for view {0}".format(view))

        # WARNING: Assume 1 rule per view function for now
        rule = app.url_map._rules_by_endpoint[endpoint][0]

        return rule

    def operation_helper(self, path=None, operations=None, **kwargs):
        if operations is None:
            return
        try:
            resource = kwargs.pop("view")
            parse_operations(resource, operations)
        except Exception as exc:
            raise exc


class APISpecExt:
    """Very simple and small extension to use apispec with this API as a flask extension"""

    def __init__(self, app=None, **kwargs):
        self.spec = None

        if app is not None:
            self.init_app(app, **kwargs)

    def init_app(self, app, **kwargs):
        app.config.setdefault("APISPEC_TITLE", "RocketMaven")
        app.config.setdefault("APISPEC_VERSION", "1.0.0")
        app.config.setdefault("OPENAPI_VERSION", "3.0.2")
        app.config.setdefault("SWAGGER_JSON_URL", "/swagger.json")
        app.config.setdefault("SWAGGER_UI_URL", "/swagger-ui")
        app.config.setdefault("SWAGGER_URL_PREFIX", None)

        self.spec = APISpec(
            title=app.config["APISPEC_TITLE"],
            version=app.config["APISPEC_VERSION"],
            openapi_version=app.config["OPENAPI_VERSION"],
            # Order is important, as MarshmallowPlugin converts the schema to a json object
            plugins=[
                FlaskRestfulPlugin(),
                MarshmallowPlugin(),
            ],
            # RestfulPlugin()
            **kwargs
        )

        blueprint = Blueprint(
            "swagger",
            __name__,
            template_folder="./templates",
            url_prefix=app.config["SWAGGER_URL_PREFIX"],
        )

        blueprint.add_url_rule(
            app.config["SWAGGER_JSON_URL"], "swagger_json", self.swagger_json
        )
        blueprint.add_url_rule(
            app.config["SWAGGER_UI_URL"], "swagger_ui", self.swagger_ui
        )

        app.register_blueprint(blueprint)

    def swagger_json(self):
        return jsonify(self.spec.to_dict())

    def swagger_ui(self):
        return render_template("swagger.j2")
