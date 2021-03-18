from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import LeaderboardSchema, PortfolioSchema
from RocketMaven.services import CompetitionService, PortfolioService
from RocketMaven.models import Portfolio
from RocketMaven.extensions import db



class LeaderboardList(Resource):

    def get(self):
        """Leaderboard
        ---
        summary: Leaderboard List
        description: List portfolios in the competition!
        tags:
          - Portfolios
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
                            $ref: '#/components/schemas/LeaderboardSchema'
        """
        return CompetitionService.get_leaderboard()


class PortfolioResource(Resource):

    method_decorators = [jwt_required()]

    def get(self, investor_id, portfolio_id):
        """
        ---
        summary: Portfolio Get
        description: Get a portfolio belonging to the specified investor
        tags:
          - Portfolios
        parameters:
          - in: path
            name: investor_id
            schema:
              type: integer
          - in: path
            name: portfolio_id
            schema:
              type: integer
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    portfolio: PortfolioSchema
          404:
            description: portfolio does not exist
        """
        return PortfolioService.get_portfolio(portfolio_id)

    def put(self, investor_id, portfolio_id):
        """
        ---
        summary: Portfolio Update
        description: Update a portfolio belonging to the specified investor
        tags:
          - Portfolios
        parameters:
          - in: path
            name: investor_id
            schema:
              type: integer
          - in: path
            name: portfolio_id
            schema:
              type: integer
        requestBody:
          content:
            application/json:
              schema:
                PortfolioSchema
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: portfolio updated
                    portfolio: PortfolioSchema
          404:
            description: portfolio does not exists
        """
        return PortfolioService.update_portfolio(portfolio_id)


class PortfolioList(Resource):

    # method_decorators = [jwt_required()]

    @jwt_required()
    def get(self, investor_id):
        """List portfolios
        ---
        summary: Portfolios List
        description: List portfolios belonging to the specified investor
        tags:
          - Portfolios
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
                  allOf:
                    - $ref: '#/components/schemas/PaginatedResult'
                    - type: object
                      properties:
                        results:
                          type: array
                          items:
                            $ref: '#/components/schemas/PortfolioSchema'
        """
        return PortfolioService.get_portfolios(investor_id)

    @jwt_required()
    def post(self, investor_id):
        """
        ---
        summary: Portfolio Create
        description: Create portfolio belonging to the specified investor
        tags:
          - Portfolios
        requestBody:
          content:
            application/json:
              schema:
                PortfolioSchema
        parameters:
          - in: path
            name: investor_id
            schema:
              type: integer
        responses:
          201:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: portfolio created
                    portfolio: PortfolioSchema
        """
        return PortfolioService.create_portfolio(investor_id)
