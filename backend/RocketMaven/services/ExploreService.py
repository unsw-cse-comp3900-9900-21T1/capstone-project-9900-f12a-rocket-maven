from flask import request
from RocketMaven.extensions import db
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.models import Asset
from RocketMaven.commons.pagination import paginate
from sqlalchemy import or_




def advanced_search():
	print("advanced_search**&****")

	country = request.args.get('country')
	currency = request.args.get('currency')
	industry = request.args.get('industry')
	q = request.args.get('q')
	print("q:",q)


	

	try:
		# https://stackoverflow.com/questions/3325467/sqlalchemy-equivalent-to-sql-like-statement
		search = "%{}%".format(q) if q else "%"
		country = country.split(',') if country else "%"
		currency = currency.split(',') if currency else "%"
		industry = industry.split(',') if industry else "%"

		country = ['%' + i.lstrip().rstrip() + '%' for i in country if i != '%']
		currency = ['%' + i.lstrip().rstrip() + '%' for i in currency if i != '%']
		industry = ['%' + i.lstrip().rstrip() + '%' for i in industry if i != '%']

		print("country:", country)
		print("currency", currency)
		print("industry", industry)

		schema = AssetSchema(many=True)
		# query = Asset.query.filter((Asset.country.in_(country)) & (Asset.currency.in_(currency)) & (Asset.industry.in_(industry)))\

		query = Asset.query.filter((or_(Asset.country.like(i) for i in country)) & (or_(Asset.currency.like(i) for i in currency)) & (or_(Asset.industry.like(i) for i in industry)))\
		.filter((Asset.ticker_symbol.like(search)) | (Asset.name.like(search))).order_by(Asset.market_cap.desc())

		# query = Asset.query.filter(Asset.currency.like('%aud%'))
		print("query: ", query)
		return paginate(query, schema)
	except Exception as e:
		print(e)
		return { "msg": "Asset search failed" }, 500