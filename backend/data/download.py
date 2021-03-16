#!/usr/bin/env python3
#
# A script for obtaining latest stock prices from the Yahoo Finance API
#

import sys
import json
import requests
import json
import os.path
from csv import DictReader, DictWriter, reader, writer


YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=longName,shortName,regularMarketPrice"


if not os.path.exists("./ASX.csv"):
    # Load ASX tickers
    with open("./ASX_Listed_Companies_13-03-2021_07-59-39_AEDT.csv") as fd, open("./ASX.csv", 'w') as out:
        res = writer(out)
        res.writerow(["ASX code","Company name","Listing date","GICs industry group", "Yahoo"])
        rdr = reader(fd)
        next(rdr)   # Skip header row
        for row in rdr:
            stock = row[0]
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=".".join([stock, "AX"]))
            
            try:
                print(endpoint)
                response = requests.get(endpoint)
                print(response)
                if response.status_code == 200:
                    data = response.json()
                    res.writerow(row + [json.dumps(data)])         
            except Exception as err:
                print(err)

if not os.path.exists("./NASDAQ.csv"):
    # Load NASDAQ tickers
     with open("./nasdaq_screener_1615582712192-NASDAQ.csv") as fd, open("./NASDAQ.csv", 'w') as out:
        res = writer(out)
        res.writerow(["Symbol","Name","Last Sale","Net Change","% Change","Market Cap","Country","IPO Year","Volume","Sector","Industry", "Yahoo"])
        rdr = reader(fd)
        next(rdr)   # Skip header row
        for row in rdr:
            stock = row[0]
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=stock)
            
            try:
                print(endpoint)
                response = requests.get(endpoint)
                print(response)
                if response.status_code == 200:
                    data = response.json()
                    res.writerow(row + [json.dumps(data)])         
            except Exception as err:
                print(err)


if not os.path.exists("./NYSE.csv"):
    # Load NASDAQ tickers
     with open("./nasdaq_screener_1615582729240-NYSE.csv") as fd, open("./NYSE.csv", 'w') as out:
        res = writer(out)
        res.writerow(["Symbol","Name","Last Sale","Net Change","% Change","Market Cap","Country","IPO Year","Volume","Sector","Industry", "Yahoo"])
        rdr = reader(fd)
        next(rdr)   # Skip header row
        for row in rdr:
            stock = row[0]
            endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=stock)
            
            try:
                print(endpoint)
                response = requests.get(endpoint)
                print(response)
                if response.status_code == 200:
                    data = response.json()
                    res.writerow(row + [json.dumps(data)])         
            except Exception as err:
                print(err)