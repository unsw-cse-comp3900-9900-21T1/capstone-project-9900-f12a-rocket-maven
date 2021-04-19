import json

import pytest
from flask import url_for


def test_iforgot():
    # TODO
    pass


def test_post_investors(client, normal_headers):
    new_investor = {
        "country_of_residency": "string",
        "date_of_birth": "2021-04-14",
        "first_name": "string",
        "gender": "string",
        "last_name": "string",
        "password": "1",
        "username": "string",
        "visibility": True
    }
    url = url_for("api.investors")
    
    # test 422
    resp = client.post(url, headers=normal_headers)
    assert resp.status_code == 422
    
    # test 201
    resp = client.post(url, data=json.dumps(new_investor))
    assert resp.status_code == 201


def test_get_leaderboard(client):
    url = url_for("api.leaderboard")

    # test 200
    resp = client.get(url)
    assert resp.status_code == 200


def test_get_public_portfolios(client, normal_headers, public_portfolio, portfolio):
    
    # test 401 - cannot test since jwt is optional?
    url = url_for("api.public_portfolio_by_id", portfolio_id=portfolio.id)
    resp = client.get(url)
    assert resp.status_code == 401

    # test 404
    url = url_for("api.public_portfolio_by_id", portfolio_id="3000")
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 404

    # test 200
    url = url_for("api.public_portfolio_by_id", portfolio_id=public_portfolio.id)
    resp = client.get(url)
    assert resp.status_code == 200
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 200


def test_get_top_additions_empty(client):
    url = url_for("api.top_additions")

    # test 404 (emty holdings)
    resp = client.get(url)
    assert resp.status_code == 404


def test_get_top_additions(client, public_portfolio_event):
    url = url_for("api.top_additions")

    # test 200
    resp = client.get(url)
    assert resp.status_code == 200
