import datetime
import io
import json
import re
import zipfile
from csv import DictReader

import requests
from flask import request
from flask_jwt_extended import get_jwt_identity
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import (Asset, Currency, CurrencyUpdate,
                                PortfolioAssetHolding)
from RocketMaven.services import TimeSeriesService
from sqlalchemy import or_
from sqlalchemy.orm import aliased


# https://stackoverflow.com/questions/312443/how-do-you-split-a-list-into-evenly-sized-chunks/312464#312464
def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=longName,shortName,regularMarketPrice"  # noqa: E501

yahoo_ticker_converters = {
    # For CRYPTO, the price is the current USD value (similar to how forex works)
    "CRYPTO": lambda stock: "-".join([stock, "USD"]),
    # For the ASX, the ticker is a combination of the asset code and ".AX"
    "ASX": lambda stock: ".".join([stock, "AX"]),
    "CURRENCY": lambda stock: stock,
}


def update_asset(asset) -> (bool, str):
    """Updates the asset current price from the Yahoo Finance API
    Returns True (and an empty string) if there were no issues
        False and an error message if an error was encountered.
    """
    exchange, stock = asset.ticker_symbol.split(":")

    if datetime.datetime.now() - asset.price_last_updated < datetime.timedelta(
        minutes=10
    ):
        return True, "Asset Price not updated"

    if exchange != "VIRT":
        # For finance yahoo, the ticker needs to be formatted according to its exchange
        if exchange in yahoo_ticker_converters:
            endpoint = YAHOO_FINANCE_ENDPOINT.format(
                ticker=yahoo_ticker_converters[exchange](stock)
            )
        else:
            # For american? stocks it is just the plain asset code
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=stock)

        try:
            response = requests.get(endpoint)
            if response.status_code == 200:
                data = response.json()
                try:
                    err = data["quoteResponse"]["error"]
                    if err is not None:
                        return False, "Error with API response {}".format(err)
                    asset.current_price = data["quoteResponse"]["result"][0][
                        "regularMarketPrice"
                    ]["raw"]
                    asset.price_last_updated = datetime.datetime.now()
                    db.session.commit()
                except IndexError:
                    return False, "Malformed API response"
        except Exception as err:
            return False, "Error updating current price - {}".format(err)
    return True, ""


# https://stackoverflow.com/questions/43269278/python-how-to-convert-a-large-zipped-csv-file-to-a-dictionary
def zip_dict_reader(filename: str) -> dict:
    """ Generates dictionary rows from a zipped CSV file """
    with zipfile.ZipFile(filename) as zipFile:
        for fname in zipFile.infolist():
            with zipFile.open(fname) as file:
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
            schema = AssetSchema(many=True)

            query = Asset.query.filter(
                or_(Asset.ticker_symbol.like(search), Asset.name.like(search))
            ).order_by(Asset.market_cap.desc())
            return paginate(query, schema)
        except Exception as e:
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

            # Get all portfolio holdings of target user
            port_query = aliased(
                PortfolioAssetHolding,
                db.session.query(PortfolioAssetHolding)
                .filter(
                    PortfolioAssetHolding.portfolio_id == portfolio_id,
                    PortfolioAssetHolding.investor_id == current_user,
                )
                .subquery(),
            )

            # Get all assets by search
            asset_query = aliased(
                Asset,
                db.session.query(Asset)
                .filter(or_(Asset.ticker_symbol.like(search), Asset.name.like(search)))
                .order_by(Asset.market_cap.desc())
                .subquery(),
            )

            # Perform a left join between Asset and Portfolio Holding
            # Essentially, if the investor has the stock, include the available information
            # Otherwise, keep that field as null
            query = db.session.query(asset_query, port_query).outerjoin(
                port_query, asset_query.ticker_symbol == port_query.asset_id
            )

            # Marshmallow doesn't support left joins, multitable schemas,
            # so a workaround is to use pure Python.
            return {
                "results": [
                    {
                        **asset_schema.dump(x[0]),
                        **{
                            "available_units": x[1].available_units if x[1] else 0,
                            "exchange": get_current_exchange(
                                x[1].orig_currency, x[1].new_currency
                            ),
                        },
                    }
                    for x in (query.limit(request.args.get("per_page", 10)).all())
                ]
            }
        except Exception as e:
            print(e)
            return {"msg": "Asset search failed"}, 500
    else:
        return {"msg": "Missing search query"}, 400


def update_assets_price(asset_query):
    """Bulk updates the data of queried assets
    Returns
    200 - if all assets are updated successfully
    500 - if an unexpected exception is raised
    """

    assets_to_update = []
    tick_to_db = {}
    for asset in asset_query:

        if not (
            datetime.datetime.now() - asset.price_last_updated
            < datetime.timedelta(minutes=10)
        ):

            exchange, stock = asset.ticker_symbol.split(":")
            if exchange != "VIRT":
                # For finance yahoo, the ticker needs to be formatted according to its exchange
                if exchange in yahoo_ticker_converters:
                    endpoint = yahoo_ticker_converters[exchange](stock)
                else:
                    # For american? stocks it is just the plain asset code
                    endpoint = stock
                assets_to_update.append(endpoint)
                tick_to_db[endpoint] = asset

    # Call the APi in batches, helps improve processing times
    for m in chunks(assets_to_update, 20):
        try:
            response = requests.get(YAHOO_FINANCE_ENDPOINT.format(ticker=",".join(m)))
            if response.status_code == 200:
                data = response.json()
                err = data["quoteResponse"]["error"]
                if err is not None:
                    return (
                        {"msg": "Error with API response {}".format(err)},
                        500,
                    )

                for result in data["quoteResponse"]["result"]:
                    asset = tick_to_db[result["symbol"]]
                    asset.current_price = result["regularMarketPrice"]["raw"]
                    asset.price_last_updated = datetime.datetime.now()
                    print(f"Updated price of: {asset.ticker_symbol}")
                db.session.commit()
        except Exception as err:
            print(f"Error updating price: {err}")

    return (
        {"msg": "Asset update success!"},
        200,
    )


def get_current_exchange(currency_from: str, currency_to: str) -> float:
    """Handle currency conversion using up-to-date currency data
    Returns
        Exchange rate of input current pairs
        (currently supports AUD and USD)"""
    if currency_from == currency_to:
        # Same currency have an exchange rate of 1:1
        return 1

    # Determine if update needed
    currency_track = CurrencyUpdate.query.filter_by(
        currency_from=currency_from, currency_to=currency_to
    ).first()
    if not currency_track:
        currency_track = CurrencyUpdate.query.filter_by(
            currency_to=currency_to, currency_from=currency_from
        ).first()
    if currency_track:
        if not currency_track.last_updated or (
            datetime.datetime.now() - currency_track.last_updated
            > datetime.timedelta(minutes=120)
        ):
            try:
                start_date = (
                    Currency.query.filter_by(
                        currency_from=currency_from, currency_to=currency_to
                    )
                    .order_by(Currency.date.desc())
                    .first()
                    .date
                )
                # start_date = datetime.datetime.strptime("2021-03-01", "%Y-%m-%d")
                end_date = datetime.datetime.now()
                data = TimeSeriesService.get_timeseries_data_advanced(
                    f"CURRENCY:{currency_from}{currency_to}=x",
                    start_date,
                    end_date,
                    TimeSeriesService.TimeSeriesInterval.OneDay,
                )[0]

                if "results" in data:
                    for m in data["results"]:
                        print("adding", m)
                        Currency.add_from_dict(
                            {
                                "Close": m["close"],
                                "Date": m["datetime"].split(" ", 1)[0],
                            },
                            currency_from,
                            currency_to,
                        )

                currency_track.last_updated = datetime.datetime.now()
                db.session.commit()
            except Exception as e:
                print(e)

        return (
            Currency.query.filter_by(
                currency_from=currency_from, currency_to=currency_to
            )
            .order_by(Currency.date.desc())
            .first()
            .value
        )

    else:
        # No currency support, so default at a 1:1 exchange
        return 1


def load_asset_single(data, asset_merge_list, **asset_data):
    """Add a single bootstrapped asset to the database"""
    try:
        asset = Asset(
            **asset_data,
            current_price=data["regularMarketPrice"]["raw"],
            market_cap=data["marketCap"]["raw"],
        )
        if asset_data["ticker_symbol"] in asset_merge_list:
            db.session.merge(asset)
        else:
            db.session.add(asset)
        # print("Added {}".format(asx_code))
    except Exception as err:
        if "marketCap" not in str(err):
            print("Unable to add {} - {}".format(asset_data["ticker_symbol"], err))


def load_asset_data(db):
    """Bootstrap process to load pre-cached stock values (from Yahoo Finance responses)
    into the system database
    """
    print("Adding Exchange Rates")

    new_entry = CurrencyUpdate(currency_from="AUD", currency_to="USD")
    db.session.add(new_entry)

    new_entry = CurrencyUpdate(currency_from="USD", currency_to="AUD")
    db.session.add(new_entry)

    with open("./data/AUDUSD=x.csv") as fb:
        for m in DictReader(fb):
            Currency.add_from_dict(m, "AUD", "USD")

    # Perform an add operation instead of an expensive merge operation whenever possible
    # This is a pretty high speed-up
    asset_merge_list = []
    for m in Asset.query.all():
        asset_merge_list.append(m.ticker_symbol)

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

        load_asset_single(
            data,
            asset_merge_list,
            ticker_symbol=ticker_symbol,
            name=company_name,
            industry=industry,
            asset_additional=row["Yahoo"],
            data_source="Yahoo",
            country=data["region"],
            currency="AUD",
            price_last_updated=datetime.datetime.strptime("2021-01-01", "%Y-%m-%d"),
        )

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

        load_asset_single(
            data,
            asset_merge_list,
            ticker_symbol=ticker_symbol,
            name=company_name,
            industry=industry,
            asset_additional=row["Yahoo"],
            data_source="Yahoo",
            country="US",
            currency="USD",
            price_last_updated=datetime.datetime.strptime("2021-01-01", "%Y-%m-%d"),
        )

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

        load_asset_single(
            data,
            asset_merge_list,
            ticker_symbol=ticker_symbol,
            name=company_name,
            industry=industry,
            asset_additional=row["Yahoo"],
            data_source="Yahoo",
            country="US",
            currency="USD",
            price_last_updated=datetime.datetime.strptime("2021-01-01", "%Y-%m-%d"),
        )

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

        load_asset_single(
            data,
            asset_merge_list,
            ticker_symbol=ticker_symbol,
            name=company_name,
            industry=industry,
            asset_additional=row["Yahoo"],
            data_source="Yahoo",
            country="ZZ",
            currency="USD",
            price_last_updated=datetime.datetime.strptime("2021-01-01", "%Y-%m-%d"),
        )

    db.session.commit()
