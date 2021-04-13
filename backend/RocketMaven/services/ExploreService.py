from flask import request
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.models import Asset
from sqlalchemy import or_


def advanced_search():
    print("advanced_search**&****")

    country = request.args.get("country")
    currency = request.args.get("currency")
    industry = request.args.get("industry")
    exchange = request.args.get("exchange")
    q = request.args.get("q")
    print("q:", q)

    if country is None and currency is None and industry is None and exchange is None and q is None:
        return {"msg": "Missing search query"}, 400
        
    order_object = Asset.market_cap.desc()

    order = request.args.get("order")
    order_direction = request.args.get("order_direction")
    if order and order_direction:
        if order == "market_cap":
            order_object = Asset.market_cap
        if order == "name":
            order_object = Asset.name
        if order == "ticker":
            order_object = Asset.ticker_symbol

        if order_direction == "asc":
            order_object = order_object.asc()
        else:
            order_object = order_object.desc()

    try:
        # https://stackoverflow.com/questions/3325467/sqlalchemy-equivalent-to-sql-like-statement
        search = "%{}%".format(q) if q else "%"
        exchange = exchange.split(",") if exchange else "%"
        country = country.split(",") if country else "%"
        currency = currency.split(",") if currency else "%"
        industry = industry.split(",") if industry else "%"

        exchange = ["%" + i.lstrip().rstrip() + "%" for i in exchange if i != "%"]
        country = ["%" + i.lstrip().rstrip() + "%" for i in country if i != "%"]
        currency = ["%" + i.lstrip().rstrip() + "%" for i in currency if i != "%"]
        industry = ["%" + i.lstrip().rstrip() + "%" for i in industry if i != "%"]

        print("exchange", exchange)
        print("country:", country)
        print("currency", currency)
        print("industry", industry)

        schema = AssetSchema(many=True)
        # query = Asset.query.filter((Asset.country.in_(country)) & (Asset.currency.in_(currency)) & (Asset.industry.in_(industry)))\

        query = (
            Asset.query.filter(
                (or_(Asset.country.like(i) for i in country))
                & (or_(Asset.ticker_symbol.like(i) for i in exchange))
                & (or_(Asset.currency.like(i) for i in currency))
                & (or_(Asset.industry.like(i) for i in industry))
            )
            .filter((Asset.ticker_symbol.like(search)) | (Asset.name.like(search)))
            .order_by(order_object)
        )

        # query = Asset.query.filter(Asset.currency.like('%aud%'))
        print("query: ", query)
        return paginate(query, schema)
    except Exception as e:
        print(e)
        return {"msg": "Asset search failed"}, 500
