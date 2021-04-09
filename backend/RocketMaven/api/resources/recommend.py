from flask import request
from flask_restful import Resource
from RocketMaven.services import RecommendationService


class Recommend(Resource):
	def post(self):


		return RecommendationService.recommend()