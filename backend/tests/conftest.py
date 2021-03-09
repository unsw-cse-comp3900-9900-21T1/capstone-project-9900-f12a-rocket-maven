import json
import pytest

# from dotenv import load_dotenv

from RocketMaven.models import Investor
from RocketMaven.app import create_app
from RocketMaven.extensions import db as _db
from pytest_factoryboy import register
from tests.factories import InvestorFactory


register(InvestorFactory)


@pytest.fixture(scope="session")
def app():
    # load_dotenv(".testenv")
    app = create_app(testing=True)
    return app


@pytest.fixture
def db(app):
    _db.drop_all()
    _db.app = app

    with app.app_context():
        _db.create_all()

    yield _db

    _db.session.close()


@pytest.fixture
def admin_user(db):
    user = Investor(
        username="admin",
        email="admin@admin.com",
        password="admin",
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
