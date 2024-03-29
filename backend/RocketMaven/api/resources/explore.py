from flask_restful import Resource
from RocketMaven.services import ExploreService


class Explore(Resource):
    def get(self):
        """
        ---
        summary: Explore
        description: Explore page with advanced searching
        tags:
          - Explore
        parameters:
          - in: query
            name: country
            description: country code split with ',' back-end support string normalization
            schema:
              type: string
          - in: query
            name: currency
            description: split with ',' back-end support string normalization
            schema:
              type: string
          - in: query
            name: industry
            description: split with ',' back-end support string normalization
            schema:
              type: string
          - in: query
            name: q
            description:
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
        security: []
        """
        return ExploreService.advanced_search()
