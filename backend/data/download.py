#!/usr/bin/env python3
#
# A script for obtaining latest stock prices from the Yahoo Finance API
#

import io
import json
import os.path
from csv import reader, writer
from typing import Callable

import requests

# https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=true&range=6mo&corsDomain=finance.yahoo.com&.tsrc=finance

YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}&fields=lastSplitDate,gmtOffSetMilliseconds,annualHoldingsTurnover,shortName,legalType,morningStarOverallRating,shortPercentOfFloat,averageVolume,headSymbolAsString,averageDailyVolume10Day,maxSupply,volumeAllCurrencies,quoteType,strikePrice,52WeekChange,underlyingSymbol,beta,exchange,lastSplitFactor,threeYearAverageReturn,fundFamily,longBusinessSummary,heldPercentInstitutions,sharesOutstanding,fiftyTwoWeekHigh,exchangeTimezoneName,volume24Hr,city,revenueQuarterlyGrowth,regularMarketDayHigh,heldPercentInsiders,regularMarketPreviousClose,country,address1,trailingAnnualDividendRate,fiveYearAvgDividendYield,regularMarketChange,mostRecentQuarter,maxAge,uuid,dividendRate,ask,fromCurrency,sharesShortPreviousMonthDate,state,profitMargins,totalAssets,sharesShortPriorMonth,regularMarketDayLow,expireDate,fundInceptionDate,openInterest,forwardEps,lastMarket,regularMarketPrice,circulatingSupply,market,zip,dividendYield,tradeable,averageVolume10days,symbol,trailingAnnualDividendYield,regularMarketChangePercent,isEsgPopulated,forwardPE,logo_url,fiftyTwoWeekLow,floatShares,trailingPE,startDate,industry,dateShortInterest,fiftyDayAverage,currency,regularMarketOpen,sharesShort,toCurrency,sector,phone,bookValue,nextFiscalYearEnd,enterpriseToEbitda,category,fromExchange,regularMarketVolume,longName,dayLow,trailingEps,morningStarRiskRating,exDividendDate,website,previousClose,open,fiveYearAverageReturn,priceHint,lastDividendValue,askSize,marketCap,lastCapGain,twoHundredDayAverage,yield,SandP52WeekChange,earningsQuarterlyGrowth,fullTimeEmployees,enterpriseValue,volume,dayHigh,shortRatio,ytdReturn,enterpriseToRevenue"


def zip_row_reader(filename: str) -> dict:
    """ Generates list rows from a zipped CSV file
    """
    with open(filename.replace(".zip", ".csv"), "rb") as file:
        rdr = reader(io.TextIOWrapper(file, encoding="utf-8"))
        next(rdr)  # Skip header row
        for m in rdr:
            yield m


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
        # Load tickers

        chunks = []
        rows = {}
        for row in zip_row_reader(src_path):
            stock = row[0]
            yahoo_stock = endpoint_fmt(stock)
            # False = no write to csv
            rows[yahoo_stock] = [False, row]
            chunks.append(yahoo_stock)
            if len(chunks) > 50:
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
    "./ASX-listing.csv",
    ["ASX code", "Company name", "Listing date", "GICs industry group", "Yahoo"],
    lambda stock: ".".join([stock, "AX"]),
)

load_data(
    "./NASDAQ.csv",
    "./NASDAQ-listing.csv",
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
    "./NYSE-listing.csv",
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
