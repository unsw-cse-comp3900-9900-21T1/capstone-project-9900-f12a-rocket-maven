#!/usr/bin/env python3
#
# A script for obtaining latest crypto prices from the Yahoo Finance API
#

import sys
import json
import requests
import json
import os.path
from typing import Callable
from csv import DictReader, DictWriter, reader, writer
import json
import io
import zipfile


YAHOO_FINANCE_ENDPOINT = "https://query2.finance.yahoo.com/v7/finance/quote?formatted=true&lang=en-AU&region=AU&symbols={ticker}"


# https://stackoverflow.com/questions/43269278/python-how-to-convert-a-large-zipped-csv-file-to-a-dictionary
def zip_row_reader(filename: str) -> dict:
    """ Generates list rows from a zipped JSON file
    """
    with zipfile.ZipFile(filename) as zipFile:
        for fname in zipFile.infolist():
            with zipFile.open(fname) as file:
                rdr = json.load(io.TextIOWrapper(file, encoding="utf-8"))
                for m in rdr:
                    if m["quoteCurrency"] == "USD":
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
                    if quote["quoteType"] == "CRYPTOCURRENCY":
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

        chunks = []
        rows = {}
        for row in zip_row_reader(src_path):
            print(row)
            stock = row["baseCurrency"]
            yahoo_stock = endpoint_fmt(stock)
            # False = no write to csv
            rows[yahoo_stock] = [False, [stock]]
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
    "./CRYPTO.csv",
    "./CRYPTO-response_1615583084533.zip",
    ["Symbol", "Yahoo"],
    lambda stock: "-".join([stock, "USD"]),
)
