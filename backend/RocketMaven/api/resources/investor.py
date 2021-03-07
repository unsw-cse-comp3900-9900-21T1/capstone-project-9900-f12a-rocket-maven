from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.services import InvestorService
from RocketMaven.models import Investor
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate


class InvestorResource(Resource):
    """Single object resource

    ---
    get:
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
          description: investor does not exists
    put:
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
    delete:
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
                  msg:
                    type: string
                    example: investor deleted
        404:
          description: investor does not exists
    """

    method_decorators = [jwt_required()]

    def get(self, investor_id):
        schema = InvestorSchema()
        investor = Investor.query.get_or_404(investor_id)
        return {"investor": schema.dump(investor)}

    def put(self, investor_id):
        schema = InvestorSchema(partial=True)
        investor = Investor.query.get_or_404(investor_id)
        investor = schema.load(request.json, instance=investor)

        db.session.commit()

        return {"msg": "investor updated", "investor": schema.dump(investor)}

    def delete(self, investor_id):
        investor = Investor.query.get_or_404(investor_id)
        db.session.delete(investor)
        db.session.commit()

        return {"msg": "investor deleted"}


class InvestorList(Resource):
    """Creation and get_all

    ---
    get:
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
    post:
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

    method_decorators = [jwt_required()]

    def get(self):
        schema = InvestorSchema(many=True)
        query = Investor.query
        return paginate(query, schema)

    def post(self):
        schema = InvestorSchema()
        investor = schema.load(request.json)

        db.session.add(investor)
        db.session.commit()

        return {"msg": "investor created", "investor": schema.dump(investor)}, 201
