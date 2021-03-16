from RocketMaven.models import Asset
from csv import DictReader


def load_asset_data(db):

    # Load CSV data
    from csv import DictReader
    import json

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
                asset.current_price = data["quoteResponse"]["result"][0]["regularMarketPrice"]["raw"]
                db.session.commit()
                continue
            try:
                asset = Asset(
                    ticker_symbol=ticker_symbol,
                    name=company_name,
                    industry=industry,
                    current_price=data["quoteResponse"]["result"][0]["regularMarketPrice"]["raw"],
                    data_source="Yahoo",
                    country=data["quoteResponse"]["result"][0]["region"],
                    currency="AUD", 
                )
                db.session.add(asset)
                db.session.commit()
                #print("Added {}".format(asx_code))
            except Exception as err:
                print("Unable to add {} - {}".format(asx_code, err))


    print("Adding NASDAQ")
    # Load NASDAQ tickers from NASDAQ.csv which is an enriched version 
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
                asset.current_price = data["quoteResponse"]["result"][0]["regularMarketPrice"]["raw"]
                db.session.commit()
                continue
            try:
                asset = Asset(
                    ticker_symbol=ticker_symbol,
                    name=company_name,
                    industry=industry,
                    current_price=data["quoteResponse"]["result"][0]["regularMarketPrice"]["raw"],
                    data_source="Yahoo",
                    country=data["quoteResponse"]["result"][0]["region"],
                    currency="AUD", 
                )
                db.session.add(asset)
                db.session.commit()
                #print("Added {}".format(asx_code))
            except Exception as err:
                print("Unable to add {} - {}".format(code, err))

    print("Adding NYSE")
    # Load NASDAQ tickers from NASDAQ.csv which is an enriched version 
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
                asset.current_price = data["quoteResponse"]["result"][0]["regularMarketPrice"]["raw"]
                db.session.commit()
                continue
            try:
                asset = Asset(
                    ticker_symbol=ticker_symbol,
                    name=company_name,
                    industry=industry,
                    current_price=data["quoteResponse"]["result"][0]["regularMarketPrice"]["raw"],
                    data_source="Yahoo",
                    country=data["quoteResponse"]["result"][0]["region"],
                    currency="AUD", 
                )
                db.session.add(asset)
                db.session.commit()
                #print("Added {}".format(asx_code))
            except Exception as err:
                print("Unable to add {} - {}".format(code, err))
