import json

import pytest
from flask import url_for
from RocketMaven.models import Asset


@pytest.fixture
def asset(db):
    asset = Asset(
        ticker_symbol="VIRT:A",
        name="Virtual Holding A",
        industry="Virtual",
        current_price=100,
        data_source="VIRTUAL",
        country="AU",
        currency="AUD",
    )

    db.session.add(asset)
    return asset
    

def test_search_assets():
    # test 400

    # test 404

    # test 200
    pass


def test_search_assets_portfolio():
    # test 401

    # test 400

    # test 404

    # test 200
    pass


def test_get_asset():
    # test 400

    # test 404

    # test 200
    pass

def test_get_asset_price():
    # test 400

    # test 404

    # test 200
    pass


