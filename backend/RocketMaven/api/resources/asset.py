from flask_jwt_extended import jwt_required
from flask_restful import Resource
from RocketMaven.services import AssetService


class AssetResource(Resource):
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
          400:
            description: Missing ticker symbol
          404:
            description: Asset does not exist
        security: []
        """
        return AssetService.get_asset(ticker_symbol)


class AssetPriceResource(Resource):
    def get(self, ticker_symbol):
        """
        ---
        summary: Get asset price
        description: Get asset price
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
                    price:
                      type: number
          400:
            description: Missing ticker symbol
          404:
            description: Asset does not exist
        security: []
        """
        return AssetService.get_asset_price(ticker_symbol)


class AssetSearchResource(Resource):
    def get(self):
        """
        ---
        summary: Search assets
        description: Search assets based on ticker or company name
        tags:
          - Asset
        parameters:
          - in: query
            name: q
            description: Parameter to search ticker/company name on
            schema:
              type: string
          - in: query
            name: per_page
            description: Number of results to return per page
            schema:
              type: string
            default: 10
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    asset: AssetSchema
          400:
            description: Missing search query
          404:
            description: No assets found
        security: []
        """
        return AssetService.search_asset()


class PortfolioAssetSearchResource(Resource):
    @jwt_required()
    def get(self, portfolio_id):
        """
        ---
        summary: Search assets considering an investor's portfolio
        description: Search assets based on ticker or company name given the
          context of an investor's portfolio, this adds the units_available
          field to applicable assets
        tags:
          - Asset
        parameters:
          - in: query
            name: q
            description: Parameter to search ticker/company name on
            schema:
              type: string
          - in: query
            name: per_page
            description: Number of results to return per page
            schema:
              type: string
            default: 10
          - in: path
            name: portfolio_id
            schema:
              type: integer
        responses:
          200:
            description: Success
          400:
            description: Missing search query
          404:
            description: No assets found
        """
        return AssetService.search_user_asset(portfolio_id)
