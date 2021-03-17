import json
from csv import DictReader
from flask import request
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.models import Asset
from RocketMaven.commons.pagination import paginate
from sqlalchemy import or_


def get_asset(ticker_symbol):
    try:
        schema = AssetSchema()
        data = Asset.query.get_or_404(ticker_symbol)
        return {"asset": schema.dump(data)}
    except:
        return {"msg": "Operation failed!"}
    
def search_asset():
    q = request.args.get("q", None)
    
    if q:
        # https://stackoverflow.com/questions/3325467/sqlalchemy-equivalent-to-sql-like-statement
        search = "%{}%".format(q)
        schema = AssetSchema(many=True)
        query = Asset.query.filter(or_(Asset.ticker_symbol.like(search), Asset.name.like(search))).order_by(Asset.market_cap.desc())
        return paginate(query, schema)

    else:
        return {"msg": "Operation failed!"}



def load_asset_data(db):

    # Load CSV data
    
    print("Adding ASX")
    # Load ASX tickers from ASX.csv which is an enriched version ASX_Listed_Companies_13-03-2021_07-59-39_AEDT.csv
    # The format of this file is CSV with columns:
    # * ASX Code
    # * Company Name
    # * Listing Date
    # * GICs industry group
    # * Yahoo Finance response
    with open("./data/ASX.csv") as fd:
        
        for row in DictReader(fd):
            
            asx_code = row["ASX code"]
            company_name = row["Company name"]
            industry = row["GICs industry group"]
            #print(row["Yahoo"])
            data = json.loads(row["Yahoo"])
            ticker_symbol = "ASX:{}".format(asx_code)
            
            asset = db.session.query(Asset).filter_by(ticker_symbol=ticker_symbol).first()
            if asset:
                print("{} already exists, updating price".format(asx_code))
                asset.current_price = data["regularMarketPrice"]["raw"]
                asset.market_cap = data["marketCap"]["raw"]
                asset.asset_additional = row["Yahoo"]

                continue
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
                )
                db.session.add(asset)
                #print("Added {}".format(asx_code))
            except Exception as err:
                if not "marketCap" in str(err):
                    print("Unable to add {} - {}".format(asx_code, err))
        db.session.commit()

    print("Adding NASDAQ")
    # Load NASDAQ tickers from NASDAQ.csv which is an enriched version of nasdaq_screener_1615582712192-NASDAQ.csv
    # The format of the columns are:
    # * Symbol
    # * Name
    # * ...
    # * Industry
    with open("./data/NASDAQ.csv") as fd:
        
        for row in DictReader(fd):
            
            code = row["Symbol"]
            company_name = row["Name"]
            industry = row["Industry"]
            #print(row["Yahoo"])
            data = json.loads(row["Yahoo"])
            ticker_symbol = "NASDAQ:{}".format(code)
            
            asset = db.session.query(Asset).filter_by(ticker_symbol=ticker_symbol).first()
            if asset:
                print("{} already exists, updating price".format(code))
                asset.current_price = data["regularMarketPrice"]["raw"]
                asset.market_cap = data["marketCap"]["raw"]
                asset.asset_additional = row["Yahoo"]
                continue
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
                )
                db.session.add(asset)
                #print("Added {}".format(asx_code))
            except Exception as err:
                if not "marketCap" in str(err):
                    print("Unable to add {} - {}".format(code, err)) 
        db.session.commit()

    print("Adding NYSE")
    # Load NASDAQ tickers from NASDAQ.csv which is an enriched version of nasdaq_screener_1615582729240-NYSE.csv
    # The format of the columns are:
    # * Symbol
    # * Name
    # * ...
    # * Industry
    with open("./data/NYSE.csv") as fd:
        
        for row in DictReader(fd):
            
            code = row["Symbol"]
            company_name = row["Name"]
            industry = row["Industry"]
            #print(row["Yahoo"])
            data = json.loads(row["Yahoo"])
            ticker_symbol = "NYSE:{}".format(code)
            
            asset = db.session.query(Asset).filter_by(ticker_symbol=ticker_symbol).first()
            if asset:
                print("{} already exists, updating price".format(code))
                asset.current_price = data["regularMarketPrice"]["raw"]
                asset.market_cap = data["marketCap"]["raw"]
                asset.asset_additional = row["Yahoo"]

                continue
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
                )
                db.session.add(asset)
                #print("Added {}".format(asx_code))
            except Exception as err:
                if not "marketCap" in str(err):
                    print("Unable to add {} - {}".format(code, err))

        db.session.commit()