import sys
import os
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.models import Investor
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate
from datetime import datetime


class Time(Resource):
    def get(self):
        """STUB: Get time
        ---
        tags:
          - Stub
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    currentTime:
                      type: string
                      example: "23:04:08"
        security: []
        """
        print('Passed through the "current-time" endpoint!', file=sys.stderr)
        print(os.environ["DATABASE_URI"])
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        return {"currentTime": current_time}


class LoginStub(Resource):
    def get(self):
        """STUB: Login get
        ---
        tags:
          - Stub
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: "Form submission successful"
        security: []
        """
        print('Passed through the "login" endpoint!', file=sys.stderr)
        return

    def post(self):
        """STUB: Login post
        ---
        tags:
          - Stub
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: "Form submission successful"
        security: []
        """
        print("Inside the login stub", file=sys.stderr)
        print(f"Values received are {request.json}", file=sys.stderr)
        # TODO(Jude): try creating and passing throgh the authentication tokens
        return {"msg": "Form submission successful"}


class PortfolioStub(Resource):
    def get(self):
        """STUB: Get portfolio
        ---
        tags:
          - Stub
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: "Form submission successful"
        security: []
        """
        print("Inside the portfolio get", file=sys.stderr)
        portfolio = (
            {
                "name": "Portfolio 1",
                "assets": [
                    {
                        "asset_name": "asset-1",
                        "info1": "a",
                        "info2": "b",
                        "info3": "c",
                        "info4": "d",
                    },
                    {
                        "asset_name": "asset-2",
                        "info1": "e",
                        "info2": "f",
                        "info3": "g",
                        "info4": "h",
                    },
                ],
            },
        )
        return {"portfolio": portfolio}


class AssetStub(Resource):
    def get(self):
        """STUB: Get asset
        ---
        tags:
          - Stub
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: "Form submission successful"
        security: []
        """
        print("Inside the asset get", file=sys.stderr)
        asset = (
            {
                "name": "asset 2",
                "detail_1": "a",
                "detail_2": "b",
                "detail_3": "c",
                "detail_4": "d",
                "detail_5": "e",
            },
        )
        return {"asset": asset}
