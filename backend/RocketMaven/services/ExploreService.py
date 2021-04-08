from flask import request
from RocketMaven.extensions import db



def advanced_search():
	print("advanced_search**&****")

	country = request.args.get('country')
	currency = request.args.get('currency')
	industry = request.args.get('industry')
	print(country, currency, industry)
	# return country, currency, industry