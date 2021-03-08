from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.services import InvestorService
from RocketMaven.models import Investor
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate


class InvestorResource(Resource):

    method_decorators = [jwt_required()]

    def get(self, investor_id):
        """Get an investor
        ---
        tags:
          - api
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
        return InvestorService.get_all_investors(investor_id)

    def put(self, investor_id):
        """Update an investor
        ---
        tags:
          - api
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

    method_decorators = [jwt_required()]

    def get(self):
        """List investors
        ---
        tags:
          - api
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
        schema = InvestorSchema(many=True)
        query = Investor.query
        return paginate(query, schema)

    def post(self):
        """Create investor:
        ---
        tags:
          - api
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
        schema = InvestorSchema()
        investor = schema.load(request.json)

        db.session.add(investor)
        db.session.commit()

        return {"msg": "investor created", "investor": schema.dump(investor)}, 201
