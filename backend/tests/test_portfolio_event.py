import json

import pytest
from flask import url_for


def test_get_portfolio_event(client, portfolio, normal_headers):
    # test 401
    url = url_for("api.portfolio_event_by_id", portfolio_id=portfolio.id)
    resp = client.get(url)
    assert resp.status_code == 401

    # test 200
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 200


def test_post_portfolio_event(client, portfolio, asset, normal_headers):
    event = {
        "add_action": True,
        "asset_id": "VIRT:B",
        "available_snapshot": 1,
        "event_date": "2021-04-14T02:09:17.449Z",
        "exchange_rate": 1,
        "fees": 0,
        "note": "string",
        "price_per_share": 1,
        "realised_snapshot": 1,
        "tax_discount_snapshot": True,
        "tax_full_snapshot": 1,
        "units": 1
    }

    # # test 401
    url = url_for("api.portfolio_event_by_id", portfolio_id=portfolio.id)
    # resp = client.post(url, data=json.dumps(event))
    # print(resp.get_json())
    # assert resp.status_code == 401
    
    # test 400
    # resp = client.post(url, data=json.dumps(event))
    # assert resp.status_code == 400

    # test 201
    resp = client.post(url, data=json.dumps(event), headers=normal_headers)
    assert resp.status_code == 201


def test_delete_portfolio_event(client, portfolio, portfolio_event, normal_headers):
    # test 401
    url = url_for("api.asset_holding_by_id", portfolio_id=portfolio.id)
    resp = client.delete(url, data=json.dumps({
        "asset_id": "VIRT:C"
    }))
    assert resp.status_code == 401

    url = url_for("api.asset_holding_by_id", portfolio_id=portfolio.id)
    resp = client.delete(url, data=json.dumps({
        "asset_id": "VIRT:C"
    }), headers=normal_headers)
    assert resp.status_code == 404

    # test 200
    resp = client.delete(url, data=json.dumps({
        "asset_id": "VIRT:B"
    }), headers=normal_headers)
    assert resp.status_code == 200
    

def test_get_holdings(client, portfolio, normal_headers):
    # test 401
    url = url_for("api.asset_holding_by_id", portfolio_id=portfolio.id)
    resp = client.get(url)
    assert resp.status_code == 401

    # test 200
    url = url_for("api.asset_holding_by_id", portfolio_id=portfolio.id)
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 200
