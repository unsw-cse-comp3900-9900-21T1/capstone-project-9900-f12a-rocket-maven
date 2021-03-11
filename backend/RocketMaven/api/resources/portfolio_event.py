from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import PortfolioEventSchema
from RocketMaven.services import PortfolioEventService
from RocketMaven.models import PortfolioEvent
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate


class PortfolioEventList(Resource):

    # method_decorators = [jwt_required()]

    @jwt_required()
    def get(self, investor_id, portfolio_id):
        """
        ---
        summary: Assets in a Portfolio
        description: List the assets in a portfolio
        tags:
          - Assets
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
                  allOf:
                    - $ref: '#/components/schemas/PaginatedResult'
                    - type: object
                      properties:
                        results:
                          type: array
                          items:
                            $ref: '#/components/schemas/PortfolioEventSchema'
        """
        return PortfolioEventService.get_events(investor_id, portfolio_id)

    @jwt_required(optional=True)
    def post(self, investor_id, portfolio_id):
        """
        ---
        summary: Asset Create
        description: Creates a new asset for a portfolio
        tags:
          - Assets
        requestBody:
          content:
            application/json:
              schema:
                PortfolioEventSchema
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
          201:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: asset created
                    portfolio_event: PortfolioEventSchema
        """
        return PortfolioEventService.create_event(investor_id, portfolio_id)
