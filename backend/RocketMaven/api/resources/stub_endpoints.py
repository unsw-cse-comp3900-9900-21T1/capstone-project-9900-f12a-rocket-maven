import sys
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

        """
        print('Passed through the "current-time" endpoint!', file=sys.stderr)
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        return {"currentTime": current_time}


class LoginStub(Resource):
    def get(self):
        """STUB: Login get
        ---

        """
        print('Passed through the "login" endpoint!', file=sys.stderr)
        return

    def post(self):
        """STUB: Login post
        ---

        """
        print("Inside the login stub", file=sys.stderr)
        print(f"Values received are {request.json}", file=sys.stderr)
        # TODO(Jude): try creating and passing throgh the authentication tokens
        return {"msg": "Form submission successfull"}


class PortfolioStub(Resource):
    def get(self):
        """STUB: Get portfolio
        ---

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
