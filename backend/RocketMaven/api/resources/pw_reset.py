from flask import request
from flask_restful import Resource
from RocketMaven.services import EmailService
from RocketMaven.extensions import db


class Pw_reset(Resource):
	def post(self):
		"""
        ---
        summary: password reset
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