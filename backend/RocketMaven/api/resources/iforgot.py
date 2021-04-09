from flask_restful import Resource
from RocketMaven.services import EmailService


class Iforgot(Resource):

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
