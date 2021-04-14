from flask_jwt_extended import jwt_required
from flask_restful import Resource
from RocketMaven.services import CompetitionService, PortfolioService


class LeaderboardList(Resource):
    @jwt_required(optional=True)
    def get(self):
        """Leaderboard
        ---
        summary: Leaderboard List
        description: List portfolios in the competition!
        tags:
          - Public
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
        security: []
        """
        return CompetitionService.get_leaderboard()


class PublicPortfolioResource(Resource):
    @jwt_required(optional=True)
    def get(self, portfolio_id):
        """
        ---
        summary: Portfolio Get
        description: Get a public portfolio belonging to the specified investor
        tags:
          - Public
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
                  type: object
                  properties:
                    portfolio: PublicPortfolioSchema
          404:
            description: portfolio does not exist
        security: []
        """
        return PortfolioService.get_public_portfolio(portfolio_id)


class PortfolioResource(Resource):

    method_decorators = [jwt_required()]

    def get(self, portfolio_id):
        """
        ---
        summary: Portfolio Get
        description: Get a portfolio belonging to the specified investor
        tags:
          - Portfolios
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
                  type: object
                  properties:
                    portfolio: PortfolioSchema
          401:
            description: unauthorised portfolio read
          404:
            description: portfolio does not exist
        """
        return PortfolioService.get_portfolio(portfolio_id)

    def put(self, portfolio_id):
        """
        ---
        summary: Portfolio Update
        description: Update a portfolio belonging to the specified investor
        tags:
          - Portfolios
        parameters:
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
          401:
            description: unauthorised portfolio update
          404:
            description: portfolio does not exists
        """
        return PortfolioService.update_portfolio(portfolio_id)

    def delete(self, portfolio_id):
        """
        ---
        summary: Portfolio Delete
        description: Delete an empty portfolio belonging to the specified investor
        tags:
          - Portfolios
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
                  type: object
                  properties:
                    msg:
                      type: string
                      example: portfolio deleted
          401:
            description: unauthorised portfolio delete
          404:
            description: portfolio does not exists
        """
        return PortfolioService.delete_portfolio(portfolio_id)


class PortfolioList(Resource):

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
          401:
            description: unauthorised portfolio list get
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


class PortfolioListAll(Resource):

    # method_decorators = [jwt_required()]

    @jwt_required(optional=True)
    def get(self, investor_id):
        """List all portfolios
        ---
        summary: Portfolios List All
        description: List all portfolios belonging to the specified investor
          without an additional api request and including deleted portfolios
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
        return PortfolioService.get_all_portfolios(investor_id)


class Report(Resource):
    @jwt_required()
    def post(self):
        """Report generation
        ---
        summary: Generate Report
        description: Generate a report for portfolios (belonging to the investor) that the investor has chosen
        tags:
          - Portfolios
        requestBody:
          content:
            application/json:
              schema:
                type: object
                properties:
                  portfolios:
                    type: array
                    portfolio_id:
                      type: integer
                  report_type:
                    type: string
                example:
                  portfolios: [1, 2]
                  report_type: "Diversification"
        responses:
          200:
            content:
              application/json:
                schema:
                    portfolio_id:
                      type: integer
        """
        return PortfolioService.get_report()


class TopAdditions(Resource):

    # TODO(Jude): Fix schema definition
    def get(self):
        """Top Additions
        ---
        summary: Portfolios List
        description: List portfolios belonging to the specified investor
        tags:
          - Public
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    portfolio: PublicPortfolioSchema
                    asset: AssetSchema
          404:
            description: error finding resources
        """
        return PortfolioService.get_top_additions()
