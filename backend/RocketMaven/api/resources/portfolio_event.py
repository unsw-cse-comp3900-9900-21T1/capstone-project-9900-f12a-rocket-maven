from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.services import PortfolioEventService


class PortfolioAssetHoldingList(Resource):

    # method_decorators = [jwt_required()]

    @jwt_required(optional=True)
    def get(self, portfolio_id):
        """
        ---
        summary: Holdings in a Portfolio
        description: List the current holdings in a portfolio
        tags:
          - Portfolio Asset Holding
        parameters:
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
                            $ref: '#/components/schemas/PortfolioAssetHoldingSchema'
        """
        return PortfolioEventService.get_holdings(portfolio_id)

    @jwt_required()
    def delete(self, portfolio_id):
        """
        ---
        summary: Delete Portfolio Asset
        description: Removes an asset from a portfolio's current holdings
        tags:
          - Portfolio Asset Holding
        parameters:
          - in: path
            name: portfolio_id
            schema:
              type: integer
        requestBody:
          content:
            application/json:
                schema:
                  type: object
                  properties:
                    asset_id:
                      type: string
                      example: ASX:CBA
                      required: true
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    msg:
                      type: string
                      example: success
        """
        return PortfolioEventService.delete_holding(portfolio_id)


class PortfolioEventList(Resource):

    # method_decorators = [jwt_required()]

    @jwt_required(optional=True)
    def get(self, portfolio_id):
        """
        ---
        summary: Asset Events in a Portfolio
        description: List the asset event history in a portfolio
        tags:
          - Portfolio Asset Event
        parameters:
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
        return PortfolioEventService.get_events(portfolio_id)

    @jwt_required(optional=True)
    def post(self, portfolio_id):
        """
        ---
        summary: Asset Event Create
        description: Creates a new asset event for a portfolio
        tags:
          - Portfolio Asset Event
        requestBody:
          content:
            application/json:
              schema:
                PortfolioEventSchema
        parameters:
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
          400:
            description: Unknown values in request
        """
        return PortfolioEventService.create_event(portfolio_id)

    @jwt_required(optional=False)
    def delete(self, portfolio_id):
        """
        ---
        summary: Asset Event Delete
        description: Deletes an asset event from a portfolio
        tags:
          - Portfolio Asset Event
        requestBody:
          content:
            application/json:
              schema:
                type: object
                properties:
                  event_id:
                    type: number
                    example: 1
                    required: true
        parameters:
          - in: path
            name: portfolio_id
            schema:
              type: integer
        responses:
          200:
            description: Event deleted
          400:
            description: Unknown values in request
        """
        return PortfolioEventService.delete_event(portfolio_id)

    @jwt_required(optional=False)
    def put(self, portfolio_id):
        """
        ---
        summary: Asset Event Update
        description: Updates an asset event from a portfolio
        tags:
          - Portfolio Asset Event
        requestBody:
          content:
            application/json:
              schema:
                PortfolioEventUpdateSchema
        parameters:
          - in: path
            name: portfolio_id
            schema:
              type: integer
        responses:
          200:
            description: Event updated
          400:
            description: Unknown values in request
        """
        return PortfolioEventService.update_event(portfolio_id)
