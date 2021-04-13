import json

import pytest
from pytest_factoryboy import register
from RocketMaven.app import create_app
from RocketMaven.extensions import db as _db
from RocketMaven.models import Asset, Investor, Portfolio
from RocketMaven.services import ExampleFullSystemService

from .factories import InvestorFactory

# from dotenv import load_dotenv


register(InvestorFactory)


@pytest.fixture(scope="session")
def app():
    # load_dotenv(".testenv")
    app = create_app(testing=True)
    return app


@pytest.fixture()
def db(app):
    _db.drop_all()
    _db.app = app

    with app.app_context():
        _db.create_all()
        # ExampleFullSystemService.populate_full_system(_db)

    yield _db

    _db.session.close()


@pytest.fixture
def admin_user(db):
    user = Investor(
        username="admin",
        email="admin@admin.com",
        password="admin",
        country_of_residency="AU",
        admin_account=True,
    )

    db.session.add(user)
    db.session.commit()

    return user

@pytest.fixture
def normal_user(db):
    user = Investor(
        username="normal",
        email="normal@normal.com",
        password="normal",
        country_of_residency="AU",
    )

    db.session.add(user)
    db.session.commit()

    return user

@pytest.fixture
def admin_headers(admin_user, client):
    data = {"username": admin_user.username, "password": "admin"}
    rep = client.post(
        "/auth/login",
        data=json.dumps(data),
        headers={"content-type": "application/json"},
    )

    tokens = json.loads(rep.get_data(as_text=True))
    return {
        "content-type": "application/json",
        "authorization": "Bearer %s" % tokens["access_token"],
    }


@pytest.fixture
def admin_refresh_headers(admin_user, client):
    data = {"username": admin_user.username, "password": "admin"}
    rep = client.post(
        "/auth/login",
        data=json.dumps(data),
        headers={"content-type": "application/json"},
    )

    tokens = json.loads(rep.get_data(as_text=True))
    return {
        "content-type": "application/json",
        "authorization": "Bearer %s" % tokens["refresh_token"],
    }

@pytest.fixture
def normal_headers(normal_user, client):
    data = {"username": normal_user.username, "password": "normal"}
    rep = client.post(
        "/auth/login",
        data=json.dumps(data),
        headers={"content-type": "application/json"},
    )

    tokens = json.loads(rep.get_data(as_text=True))
    return {
        "content-type": "application/json",
        "authorization": "Bearer %s" % tokens["access_token"],
    }


@pytest.fixture
def normal_refresh_headers(normal_user, client):
    data = {"username": normal_user.username, "password": "normal"}
    rep = client.post(
        "/auth/login",
        data=json.dumps(data),
        headers={"content-type": "application/json"},
    )

    tokens = json.loads(rep.get_data(as_text=True))
    return {
        "content-type": "application/json",
        "authorization": "Bearer %s" % tokens["refresh_token"],
    }


@pytest.fixture
def portfolio(db, normal_user):
    portfolio = Portfolio(
        currency="AUD",
        tax_residency="AU",
        name="My First Portfolio!",
        description="Seeing if I should invest or not",
        competition_portfolio=False,
        buying_power=None,
        investor_id=normal_user.id,
    )
    db.session.add(portfolio)
    db.session.commit()

    return portfolio

@pytest.fixture
def public_portfolio(db, normal_user):
    pub_portfolio = Portfolio(
        currency="AUD",
        tax_residency="AU",
        name="My Public Portfolio!",
        description="For all to see",
        competition_portfolio=False,
        buying_power=None,
        investor_id=normal_user.id,
        public_portfolio=True
    )
    db.session.add(pub_portfolio)
    db.session.commit()
    return pub_portfolio

@pytest.fixture
def asset(db):
    asset = Asset(
        ticker_symbol="VIRT:B",
        name="Virtual Holding B",
        industry="Virtual",
        current_price=100,
        data_source="VIRTUAL",
        country="AU",
        currency="AUD",
    )

    db.session.add(asset)
    return asset
