from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.services import InvestorService
from RocketMaven.models import Investor
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
        """
        investor_creation = InvestorService.create_investor()
        return InvestorService.automatically_login_user_after_creation(
            investor_creation
        )
