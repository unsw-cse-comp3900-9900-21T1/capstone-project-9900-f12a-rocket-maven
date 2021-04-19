import json

import pytest
from flask import url_for
from RocketMaven.models import Asset


def test_search_assets(client, asset):
    # test 400
    url = url_for("api.asset_search")
    resp = client.get(url) 
    assert resp.status_code == 400

    # test 200
    query = {
        "q": "B"
    }
    resp = client.get(url, query_string=query) 
    assert resp.status_code == 200
    assert any(res["ticker_symbol"] == asset.ticker_symbol for res in resp.get_json()["results"])
    

def test_search_assets_portfolio(client, portfolio, asset, portfolio_event, normal_headers):
    # test 401
    url = url_for("api.user_asset_search", portfolio_id=portfolio.id)
    resp = client.get(url)
    assert resp.status_code == 401

    # test 400
    url = url_for("api.user_asset_search", portfolio_id=portfolio.id)
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 400

    # test 200 - Asset holding available
    url = url_for("api.user_asset_search", portfolio_id=portfolio.id)
    resp = client.get(url, query_string={"q":"B"}, headers=normal_headers)
    assert resp.status_code == 200


    # test 200 - Asset holding not available
    url = url_for("api.user_asset_search", portfolio_id=portfolio.id)
    resp = client.get(url, query_string={"q":"A"}, headers=normal_headers)
    assert resp.status_code == 200


def test_get_asset(client, asset):
    # test 400 - cannot test due to endpoint routing requiring this value
    
    # test 404
    url = url_for("api.asset_by_ticker", ticker_symbol="unknown")
    resp = client.get(url)
    assert resp.status_code == 404
    
    # test 200
    url = url_for("api.asset_by_ticker", ticker_symbol=asset.ticker_symbol)
    resp = client.get(url)
    assert resp.status_code == 200
    
    
def test_get_asset_price(client, asset):
    # test 400 - cannot test due to endpoint routing requiring this value

    # test 404
    url = url_for("api.asset_price_by_ticker", ticker_symbol="unknown")
    resp = client.get(url)
    assert resp.status_code == 404
    
    # test 200
    url = url_for("api.asset_price_by_ticker", ticker_symbol=asset.ticker_symbol)
    resp = client.get(url)
    assert resp.status_code == 200
