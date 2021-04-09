from flask import request
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.models import Asset


def advanced_search():
    print("advanced_search**&****")

    country = request.args.get('country')
    currency = request.args.get('currency')
    industry = request.args.get('industry')
    q = request.args.get('q')
    print("q:", q)
    print("country:", country)
    print("currency", currency)
    print("industry", industry)

    try:
        # https://stackoverflow.com/questions/3325467/sqlalchemy-equivalent-to-sql-like-statement
        search = "%{}%".format(q) if q else "%"
        country = "%{}%".format(country) if country else "%"
        currency = "%{}%".format(currency) if currency else "%"
        industry = "%{}%".format(industry) if industry else "%"

        schema = AssetSchema(many=True)
        query = Asset.query.filter((Asset.country.like(country))
                                   & (Asset.currency.like(currency))
                                   & (Asset.industry.like(industry)))\
            .filter((Asset.ticker_symbol.like(search)) | (Asset.name.like(search))).order_by(Asset.market_cap.desc())
        print("query: ", query)
        return paginate(query, schema)
    except Exception as e:
        print(e)
        return {"msg": "Asset search failed"}, 500
