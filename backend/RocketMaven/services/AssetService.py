import io
import json
import re
from csv import DictReader
from datetime import datetime

from flask import request
from flask_jwt_extended import get_jwt_identity
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import Asset, PortfolioAssetHolding
from RocketMaven.services.PortfolioEventService import update_asset
from sqlalchemy import or_
from sqlalchemy.orm import aliased


def zip_dict_reader(filename: str) -> dict:
    """Generates dictionary rows from a zipped CSV file"""
    with open(filename.replace(".zip", ".csv"), "rb") as file:
        for m in DictReader(io.TextIOWrapper(file, encoding="utf-8")):
            yield m


def get_asset(ticker_symbol: str):
    """Returns
    200 - the associated Asset for the given ticker symbol
    400 - ticker symbol is None
    404 - if the ticker symbol doesn't exist
    500 - if an unexpected exception is raised
    """
    if ticker_symbol is None:
        return {"msg": "Missing ticker symbol"}, 400
    data = Asset.query.get_or_404(ticker_symbol)
    try:
        schema = AssetSchema()
        return {"asset": schema.dump(data)}, 200
    except Exception as err:
        print(err)
        return {"msg": "Operation failed!"}, 500


def get_asset_price(ticker_symbol: str):
    """Returns
    200 - the associated price for the given ticker symbol
    400 - ticker symbol is None
    404 - if the ticker symbol doesn't exist
    500 - if an unexpected exception is raised
    """
    if ticker_symbol is None:
        return {"msg": "Missing ticker symbol"}, 400
    try:

        print(ticker_symbol)
        data = db.session.query(Asset).filter_by(ticker_symbol=ticker_symbol).first()
        if data:
            update_asset(data)
            data = (
                db.session.query(Asset).filter_by(ticker_symbol=ticker_symbol).first()
            )
            return {"price": data.current_price}, 200
        return {"msg": "Ticker does not exist"}, 404
    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}, 500


def search_asset():
    """Returns
    200 - a paginated list of Assets that match the given user query in the request
    400 - missing search query
    500 - if an unexpected exception is raised
    """
    q = request.args.get("q", None)

    if q:
        try:
            # https://stackoverflow.com/questions/3325467/sqlalchemy-equivalent-to-sql-like-statement
            search = "%{}%".format(q)
            print(search)
            schema = AssetSchema(many=True)

            query = Asset.query.filter(
                or_(Asset.ticker_symbol.like(search), Asset.name.like(search))
            ).order_by(Asset.market_cap.desc())
            return paginate(query, schema)
        except Exception as e:
            print(e)
            return {"msg": "Asset search failed"}, 500
    else:
        return {"msg": "Missing search query"}, 400


def search_user_asset(portfolio_id):
    """Returns
    200 - a paginated list of Assets that match the given user query in the request
    400 - missing search query
    500 - if an unexpected exception is raised
    """
    q = request.args.get("q", None)
    current_user = get_jwt_identity()

    if q:
        try:
            # https://stackoverflow.com/questions/3325467/sqlalchemy-equivalent-to-sql-like-statement
            search = "%{}%".format(q)
            asset_schema = AssetSchema()

            port_query = aliased(
                PortfolioAssetHolding,
                db.session.query(PortfolioAssetHolding)
                .filter(
                    PortfolioAssetHolding.portfolio_id == portfolio_id,
                    PortfolioAssetHolding.investor_id == current_user,
                )
                .subquery(),
            )

            asset_query = aliased(
                Asset,
                db.session.query(Asset)
                .filter(or_(Asset.ticker_symbol.like(search), Asset.name.like(search)))
                .order_by(Asset.market_cap.desc())
                .subquery(),
            )

            query = db.session.query(asset_query, port_query).outerjoin(
                port_query, asset_query.ticker_symbol == port_query.asset_id
            )

            return {
                "results": [
                    {
                        **asset_schema.dump(x[0]),
                        **{"available_units": x[1].available_units if x[1] else 0},
                    }
                    for x in (query.limit(request.args.get("per_page", 10)).all())
                ]
            }
        except Exception as e:
            print(e)
            return {"msg": "Asset search failed"}, 500
    else:
        return {"msg": "Missing search query"}, 400


def load_asset_data(db):
    """Bootstrap process to load pre-cached stock values (from Yahoo Finance responses)
    into the system database
    """

    print("Adding ASX")
    # Load ASX tickers from ASX.csv which is an enriched version ASX_Listed_Companies_13-03-2021_07-59-39_AEDT.csv
    # The format of this file is CSV with columns:
    # * ASX Code
    # * Company Name
    # * Listing Date
    # * GICs industry group
    # * Yahoo Finance response

    for row in zip_dict_reader("./data/ASX.zip"):

        asx_code = row["ASX code"]
        company_name = row["Company name"]
        industry = row["GICs industry group"]
        data = json.loads(row["Yahoo"])
        ticker_symbol = "ASX:{}".format(asx_code)

        try:
            asset = Asset(
                ticker_symbol=ticker_symbol,
                name=company_name,
                industry=industry,
                current_price=data["regularMarketPrice"]["raw"],
                market_cap=data["marketCap"]["raw"],
                asset_additional=row["Yahoo"],
                data_source="Yahoo",
                country=data["region"],
                currency="AUD",
                price_last_updated=datetime.strptime(
                    "2021-01-01", "%Y-%m-%d"
                ),  # datetime.date.fromisoformat("2021-01-01"),
            )
            db.session.merge(asset)
            # print("Added {}".format(asx_code))
        except Exception as err:
            if "marketCap" not in str(err):
                print("Unable to add {} - {}".format(asx_code, err))

    print("Adding NASDAQ")
    # Load NASDAQ tickers from NASDAQ.csv which is an enriched version of nasdaq_screener_1615582712192-NASDAQ.csv
    # The format of the columns are:
    # * Symbol
    # * Name
    # * ...
    # * Industry
    for row in zip_dict_reader("./data/NASDAQ.zip"):

        code = row["Symbol"]
        company_name = row["Name"]
        industry = row["Industry"]
        # print(row["Yahoo"])
        data = json.loads(row["Yahoo"])
        ticker_symbol = "NASDAQ:{}".format(code)

        try:
            asset = Asset(
                ticker_symbol=ticker_symbol,
                name=company_name,
                industry=industry,
                current_price=data["regularMarketPrice"]["raw"],
                market_cap=data["marketCap"]["raw"],
                asset_additional=row["Yahoo"],
                data_source="Yahoo",
                country="US",
                currency="USD",
                price_last_updated=datetime.strptime(
                    "2021-01-01", "%Y-%m-%d"
                ),  # datetime.date.fromisoformat("2021-01-01"),
            )
            db.session.merge(asset)
            # print("Added {}".format(asx_code))
        except Exception as err:
            if "marketCap" not in str(err):
                print("Unable to add {} - {}".format(code, err))

    print("Adding NYSE")
    # Load NYSE tickers from NYSE.csv which is an enriched version of nasdaq_screener_1615582729240-NYSE.csv
    # The format of the columns are:
    # * Symbol
    # * Name
    # * ...
    # * Industry
    for row in zip_dict_reader("./data/NYSE.zip"):

        code = row["Symbol"]
        company_name = row["Name"]
        industry = row["Industry"]
        # print(row["Yahoo"])
        data = json.loads(row["Yahoo"])
        ticker_symbol = "NYSE:{}".format(code)

        try:
            asset = Asset(
                ticker_symbol=ticker_symbol,
                name=company_name,
                industry=industry,
                current_price=data["regularMarketPrice"]["raw"],
                market_cap=data["marketCap"]["raw"],
                asset_additional=row["Yahoo"],
                data_source="Yahoo",
                country="US",
                currency="US",
                price_last_updated=datetime.strptime(
                    "2021-01-01", "%Y-%m-%d"
                ),  # datetime.date.fromisoformat("2021-01-01"),
            )
            db.session.merge(asset)
            # print("Added {}".format(asx_code))
        except Exception as err:
            if "marketCap" not in str(err):
                print("Unable to add {} - {}".format(code, err))

    print("Adding CRYPTO")
    # The format of the columns are:
    # * Symbol
    # * Name
    # * ...
    for row in zip_dict_reader("./data/CRYPTO.zip"):

        code = row["Symbol"]
        # print(row["Yahoo"])
        data = json.loads(row["Yahoo"])

        company_name = re.sub(" USD$", "", data["shortName"])
        industry = "Non-Fiat"

        ticker_symbol = "CRYPTO:{}".format(code)

        try:
            asset = Asset(
                ticker_symbol=ticker_symbol,
                name=company_name,
                industry=industry,
                current_price=data["regularMarketPrice"]["raw"],
                market_cap=data["marketCap"]["raw"],
                asset_additional=row["Yahoo"],
                data_source="Yahoo",
                country="ZZ",
                currency="US",
                price_last_updated=datetime.strptime(
                    "2021-01-01", "%Y-%m-%d"
                ),  # datetime.date.fromisoformat("2021-01-01"),
            )
            db.session.merge(asset)
            # print("Added {}".format(asx_code))
        except Exception as err:
            if "marketCap" not in str(err):
                print("Unable to add {} - {}".format(code, err))

    db.session.commit()
