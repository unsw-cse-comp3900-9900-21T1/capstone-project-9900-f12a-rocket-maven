import json

import pytest
from flask import url_for


def test_get_watchlist(client, normal_headers):
    # test 401
    url = url_for("api.watchlist")
    resp = client.get(url)
    assert resp.status_code == 401

    # test 400 - can't test?

    # test 404 - can't test as investor_id is linked to jwt token

    # test 200
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 200
    assert resp.get_json()["results"] == []

def test_add_watchlist(client, normal_headers, asset):
    # test 401
    url = url_for("api.watchlist_update", ticker_symbol=asset.ticker_symbol)
    resp = client.post(url)
    assert resp.status_code == 401

    # test 404
    url = url_for("api.watchlist_update", ticker_symbol="UNKNOWN")
    resp = client.post(url, headers=normal_headers)
    assert resp.status_code == 404

    # test 404 - can't test as investor_id is linked to jwt token

    # test 201
    url = url_for("api.watchlist_update", ticker_symbol=asset.ticker_symbol)
    resp = client.post(url, headers=normal_headers)
    assert resp.status_code == 201
    
def test_delete_watchlist(client, normal_headers, asset):
    # test 401
    url = url_for("api.watchlist_update", ticker_symbol=asset.ticker_symbol)
    resp = client.delete(url)
    assert resp.status_code == 401

    # test 400
    url = url_for("api.watchlist_update", ticker_symbol="UNKNOWN")
    resp = client.delete(url, headers=normal_headers)
    assert resp.status_code == 400

    # test 404 - can't test as investor_id is linked to jwt token

    # test 200
    url = url_for("api.watchlist_update", ticker_symbol=asset.ticker_symbol)
    resp = client.post(url, headers=normal_headers)
    assert resp.status_code == 201

    resp = client.delete(url, headers=normal_headers)
    assert resp.status_code == 200

