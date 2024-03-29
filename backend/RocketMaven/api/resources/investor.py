from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from RocketMaven.services import EmailService, InvestorService, WatchlistService


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
        security: []
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
          - Watchlist
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
            description: asset/investor does not exist
        """
        current_user = get_jwt_identity()
        return WatchlistService.add_watchlist(current_user, ticker_symbol)

    @jwt_required()
    def delete(self, ticker_symbol):
        """
        ---
        summary: Remove an asset from the investor's watchlist
        description: Remove an asset from the investor's watchlist
        tags:
          - Watchlist
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
            description: asset/investor does not exist
        """
        current_user = get_jwt_identity()
        return WatchlistService.del_watchlist(current_user, ticker_symbol)


class WatchList(Resource):
    @jwt_required()
    def get(self):
        """
        ---
        summary: Get the user's watchlist
        tags:
          - Watchlist
        responses:
          200:
            description: Get the assets in user's watchlist
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
                            $ref: '#/components/schemas/AssetSchema'
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        current_user = get_jwt_identity()
        return WatchlistService.get_watchlist(current_user)


class WatchlistNotify(Resource):
    def get(self):
        """
        ---
        summary: Sends an email to all users based on their watchlist preference
        tags:
          - Watchlist
        responses:
          200:
            description: Email success
          400:
            description: Email failed
        """
        return WatchlistService.send_watchlist_email()


class NotificationLow(Resource):
    @jwt_required()
    def put(self, ticker_symbol):
        """
        ---
        summary: put notification
        tags:
          - Watchlist
        requestBody:
              content:
                application/json:
                  schema:
                    type: object
        parameters:
            - in: path
              name: ticker_symbol
              schema:
                type: string
        responses:
          200:
            description: set notification
            content:
              application/json:
                schema:
                  type: string
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        current_user = get_jwt_identity()
        return WatchlistService.set_nofication("low", current_user, ticker_symbol)


class NotificationHigh(Resource):
    @jwt_required()
    def put(self, ticker_symbol):
        """
        ---
        summary: put notification
        tags:
          - Watchlist
        requestBody:
              content:
                application/json:
                  schema:
                    type: object
        parameters:
            - in: path
              name: ticker_symbol
              schema:
                type: string
        responses:
          200:
            description: set notification
            content:
              application/json:
                schema:
                  type: string
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        current_user = get_jwt_identity()
        return WatchlistService.set_nofication("high", current_user, ticker_symbol)


class PasswordForgot(Resource):
    def post(self):
        """
        ---
        summary: Password Forgot
        description: password reset page
        tags:
          - Public
        requestBody:
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: email
                    required: true

        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    investor: InvestorSchema
          400:
            description: Malformed request
          404:
            description: investor does not exist
        security: []
        """
        return EmailService.try_reset()


class PasswordReset(Resource):
    def post(self):
        """
        ---
        summary: Password Reset
        description: password reset page
        tags:
          - Investors
        requestBody:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    email:
                      type: string
                      example: email
                      required: true

        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    investor: InvestorSchema
          400:
            description: Malformed request
          404:
            description: investor does not exist
        """
        return EmailService.change_password()
