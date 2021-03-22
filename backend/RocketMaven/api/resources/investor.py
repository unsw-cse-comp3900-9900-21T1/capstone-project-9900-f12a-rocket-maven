from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.services import InvestorService, WatchlistService
from RocketMaven.models import Investor, Asset
from RocketMaven.extensions import db


class InvestorResource(Resource):

    method_decorators = [jwt_required()]

    def get(self, investor_id):
        """
        ---
        summary: Investor Get
        description: Get an investor
        tags:
          - Investors
        parameters:
          - in: path
            name: investor_id
            schema:
              type: integer
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    investor: InvestorSchema
          404:
            description: investor does not exist
        """
        return InvestorService.get_investor(investor_id)

    def put(self, investor_id):
        """
        ---
        summary: Investor Update
        description: Update an investor
        tags:
          - Investors
        parameters:
          - in: path
            name: investor_id
            schema:
              type: integer
        requestBody:
          content:
            application/json:
              schema:
                InvestorSchema
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: investor updated
                    investor: InvestorSchema
          404:
            description: investor does not exists
        """
        return InvestorService.update_investor(investor_id)


class InvestorList(Resource):

    # method_decorators = [jwt_required()]

    @jwt_required()
    def get(self):
        """
        ---
        summary: Investors List
        description: List investors
        tags:
          - Investors
        responses:
          200:
            content:
              application/json:
                schema:
                  allOf:
                    - $ref: '#/components/schemas/PaginatedResult'
                    - type: object
                      properties:
                        results:
                          type: array
                          items:
                            $ref: '#/components/schemas/InvestorSchema'
        """
        return InvestorService.get_investors()

    @jwt_required(optional=True)
    def post(self):
        """
        ---
        summary: Investors Create
        description: Create an investor
        tags:
          - Public
        requestBody:
          content:
            application/json:
              schema:
                InvestorSchema
        responses:
          201:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: investor created
                    investor: InvestorSchema
          422:
            # Unprocessable Entity, request is valid, but not accepted by the DB.
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: Operation failed!
        """
        investor_creation = InvestorService.create_investor()
        if investor_creation[1] == 422:
            return investor_creation
        return InvestorService.automatically_login_user_after_creation(
            investor_creation
        )


class WatchAsset(Resource):

    @jwt_required()
    def post(self, ticker_symbol):
        """
        ---
        summary: Add an asset to watchlist
        description: Add an asset to watchlist
        tags:
          - WatchList
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string
        responses:
          201:
            description: Asset added to watchlist
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        current_user = get_jwt_identity()
        print(ticker_symbol, current_user)
        return {}, 501

    @jwt_required()
    def delete(self, ticker_symbol):
        """
        ---
        summary: Remove an asset from the investor's watchlist
        description: Remove an asset from the investor's watchlist
        tags:
          - WatchList
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string
        responses:
          200:
            description: Asset removed from watchlist
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        current_user = get_jwt_identity()
        print(ticker_symbol, current_user)
        return {}, 501

class WatchList(Resource):

    @jwt_required()
    def get(self):
        """
        ---
        summary: Get the user's watchlist
        tags:
          - WatchList
        responses:
          200:
            description: Get the assets in user's watchlist
            content:
              application/json:
                schema:
                  type: array
                  items:
                    $ref: '#/components/schemas/AssetSchema'
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        current_user = get_jwt_identity()
        print(current_user)
        return {}, 501
    

