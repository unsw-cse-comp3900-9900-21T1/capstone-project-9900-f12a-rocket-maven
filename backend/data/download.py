#!/usr/bin/env python3
#
# A script for obtaining latest stock prices from the Yahoo Finance API
#

import sys
import json
import requests
import json
import os.path
from typing import Callable
from csv import DictReader, DictWriter, reader, writer

# https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=true&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance

YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=messageBoardId,longName,shortName,marketCap,underlyingSymbol,underlyingExchangeSymbol,headSymbolAsString,regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,uuid,regularMarketOpen,fiftyTwoWeekLow,fiftyTwoWeekHigh,toCurrency,fromCurrency,toExchange,fromExchange"


def batch_endpoint_get(rows: dict, chunks, endpoint_fmt: Callable[[str], str]):
    endpoint = YAHOO_FINANCE_ENDPOINT.format(ticker=(",".join(chunks)).upper())

    try:
        print(endpoint)
        response = requests.get(endpoint)
        print(response)
        if response.status_code == 200:
            data = response.json()
            for quote in data["quoteResponse"]["result"]:
                sym = quote["symbol"]
                if sym in rows:
                    rows[sym][0] = True
                    rows[sym][1].append(json.dumps(quote))
                else:
                    print("Mismatched symbol: ", sym)

    except Exception as err:
        print(err)


def load_data(
    out_path: str, src_path: str, row_headers: list, endpoint_fmt: Callable[[str], str]
):
    if not os.path.exists(out_path):
        # Load ASX tickers

        chunks = []
        rows = {}
        with open(src_path) as fd:
            rdr = reader(fd)
            next(rdr)  # Skip header row
            for row in rdr:
                stock = row[0]
                yahoo_stock = endpoint_fmt(stock)
                # False = no write to csv
                rows[yahoo_stock] = [False, row]
                chunks.append(yahoo_stock)
                if len(chunks) > 20:
                    batch_endpoint_get(rows, chunks, endpoint_fmt)
                    chunks = []

        if len(chunks) > 0:
            batch_endpoint_get(rows, chunks, endpoint_fmt)

        with open(out_path, "w", newline="\n") as out:
            res = writer(out)
            res.writerow(row_headers)
            for row in rows.values():
                if row[0]:
                    res.writerow(row[1])


load_data(
    "./ASX.csv",
    "./ASX_Listed_Companies_13-03-2021_07-59-39_AEDT.csv",
    ["ASX code", "Company name", "Listing date", "GICs industry group", "Yahoo"],
    lambda stock: ".".join([stock, "AX"]),
)

load_data(
    "./NASDAQ.csv",
    "./nasdaq_screener_1615582712192-NASDAQ.csv",
    [
        "Symbol",
        "Name",
        "Last Sale",
        "Net Change",
        "% Change",
        "Market Cap",
        "Country",
        "IPO Year",
        "Volume",
        "Sector",
        "Industry",
        "Yahoo",
    ],
    lambda stock: stock,
)

load_data(
    "./NYSE.csv",
    "./nasdaq_screener_1615582729240-NYSE.csv",
    [
        "Symbol",
        "Name",
        "Last Sale",
        "Net Change",
        "% Change",
        "Market Cap",
        "Country",
        "IPO Year",
        "Volume",
        "Sector",
        "Industry",
        "Yahoo",
    ],
    lambda stock: stock,
)
