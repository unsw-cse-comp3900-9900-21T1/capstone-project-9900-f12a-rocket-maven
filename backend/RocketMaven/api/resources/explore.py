from flask_restful import Resource

from RocketMaven.services import ExploreService

class Explore(Resource):

    def post(self):
        """
        ---
        summary: Explore
        description: Explore page with advanced searching
        tags:
          - Explore
        parameters:
          - in: query
            name: country
            description: country
            schema:
              type: string
          - in: query
            name: currency
            description: currency
            schema:
              type: string
          - in: query
            name: industry
            description: industry
            schema:
              type: string
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    asset: AssetSchema
          400:
            description: Missing search query
          404:
            description: No assets found
        security: []
        """
        return ExploreService.advanced_search()