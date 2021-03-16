from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.services import AssetService
from RocketMaven.models import Asset
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate


class AssetResource(Resource):

    #method_decorators = [jwt_required()]

    def get(self, ticker_symbol):
        """
        ---
        summary: Get asset details
        description: Get asset details
        tags:
          - Asset
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    asset: AssetSchema
          404:
            description: asset does not exist
        """
        return AssetService.get_asset(ticker_symbol)
