from flask import request
from flask_restful import Resource
from RocketMaven.api.schemas import InvestorSchema###
from RocketMaven.services import EmailService
from RocketMaven.models import Investor###
from RocketMaven.extensions import db


class Pw_resetting(Resource):
	def post(self, emailTo):
		return EmailService.try_reset(emailTo)