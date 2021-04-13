import json

import pytest
from flask import url_for
from RocketMaven.models import Portfolio


def test_get_portfolio(portfolio, client, normal_user, normal_headers):
    # test 401
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id=normal_user.id)
    resp = client.get(portfolio_url)
    assert resp.status_code == 401

    # test 404
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id="2000")
    resp = client.get(portfolio_url, headers=normal_headers)
    assert resp.status_code == 404

    portfolio_url = url_for("api.portfolio_by_id", portfolio_id=normal_user.id)
    resp = client.get(portfolio_url, headers=normal_headers)
    assert resp.status_code == 200
    portfolio_resp = resp.get_json()
    assert "portfolio" in portfolio_resp
    assert portfolio_resp["portfolio"]["name"] == "My First Portfolio!"
    

def test_get_public_portfolio(portfolio, client, normal_user, normal_headers):
    # test 401
    portfolio_url = url_for("api.public_portfolio_by_id", portfolio_id=portfolio.id)
    resp = client.get(portfolio_url)
    assert resp.status_code == 401

    # test 404
    portfolio_url = url_for("api.public_portfolio_by_id", portfolio_id="2000")
    resp = client.get(portfolio_url, headers=normal_headers)
    assert resp.status_code == 404

    # test 200
    portfolio_url = url_for("api.public_portfolio_by_id", portfolio_id=normal_user.id)
    resp = client.get(portfolio_url, headers=normal_headers)
    assert resp.status_code == 200


def test_update_portfolio(portfolio, client, normal_user, normal_headers):
    data = {
        "name": "update name"
    }

    # test 401
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id=portfolio.id)
    resp = client.put(portfolio_url, data=json.dumps(data))
    assert resp.status_code == 401
    
    # test 404
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id="2000")
    resp = client.put(portfolio_url, headers=normal_headers, data=json.dumps(data))
    assert resp.status_code == 404

    # test 200
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id=portfolio.id)
    resp = client.put(portfolio_url, headers=normal_headers, data=json.dumps(data))
    assert resp.status_code == 200
    assert resp.get_json()["portfolio"]["name"] == "update name"


def test_delete_portfolio(portfolio, client, normal_user, normal_headers):
    # test 401
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id=portfolio.id)
    resp = client.delete(portfolio_url)
    assert resp.status_code == 401

    # test 404
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id="2000")
    resp = client.delete(portfolio_url, headers=normal_headers)
    assert resp.status_code == 404

    # test 200
    portfolio_url = url_for("api.portfolio_by_id", portfolio_id=portfolio.id)
    resp = client.delete(portfolio_url, headers=normal_headers)
    assert resp.status_code == 200
    assert resp.get_json()["msg"] == "Portfolio Deleted"


def test_get_portfolios(client, normal_user, normal_headers):
    # test 401
    portfolio_url = url_for("api.portfolios", investor_id=normal_user.id)
    resp = client.get(portfolio_url)
    assert resp.status_code == 401

    # test 200
    portfolio_url = url_for("api.portfolios", investor_id=normal_user.id)
    resp = client.get(portfolio_url, headers=normal_headers)
    assert resp.status_code == 200
    assert resp.get_json()["results"] == []

def test_get_all_portfolios(client, normal_user, normal_headers):
    # test 200
    portfolio_url = url_for("api.all_portfolios", investor_id=normal_user.id)
    resp = client.get(portfolio_url, headers=normal_headers)
    assert resp.status_code == 200
    assert resp.get_json()["results"] == []


def test_post_report(client, normal_headers):
    # test 401
    portfolio_url = url_for("api.report")
    resp = client.post(portfolio_url)
    assert resp.status_code == 401

    data = {
        "portfolios": [
            1,
            2
        ],
        "report_type": "Diversification"
    }

    # test 200
    portfolio_url = url_for("api.report")
    resp = client.post(portfolio_url, headers=normal_headers, data=json.dumps(data))
    assert resp.status_code == 200
