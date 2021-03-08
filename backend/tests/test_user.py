from flask import url_for

from RocketMaven.extensions import pwd_context
from RocketMaven.models import Investor


def test_get_investor(client, db, investor, admin_headers):
    # test 404
    investor_url = url_for("api.investor_by_id", investor_id="100000")
    rep = client.get(investor_url, headers=admin_headers)
    assert rep.status_code == 404

    db.session.add(investor)
    db.session.commit()

    # test get_investor
    investor_url = url_for("api.investor_by_id", investor_id=investor.id)
    rep = client.get(investor_url, headers=admin_headers)
    assert rep.status_code == 200

    data = rep.get_json()["investor"]
    assert data["username"] == investor.username
    assert data["email"] == investor.email
    assert data["active"] == investor.active


def test_put_investor(client, db, investor, admin_headers):
    # test 404
    investor_url = url_for("api.investor_by_id", investor_id="100000")
    rep = client.put(investor_url, headers=admin_headers)
    assert rep.status_code == 404

    db.session.add(investor)
    db.session.commit()

    data = {"username": "updated", "password": "new_password"}

    investor_url = url_for("api.investor_by_id", investor_id=investor.id)
    # test update investor
    rep = client.put(investor_url, json=data, headers=admin_headers)
    assert rep.status_code == 200

    data = rep.get_json()["investor"]
    assert data["username"] == "updated"
    assert data["email"] == investor.email
    assert data["active"] == investor.active

    db.session.refresh(investor)
    assert pwd_context.verify("new_password", investor.password)


# def test_delete_investor(client, db, investor, admin_headers):
#     # test 404
#     investor_url = url_for("api.investor_by_id", investor_id="100000")
#     rep = client.delete(investor_url, headers=admin_headers)
#     assert rep.status_code == 404

#     db.session.add(investor)
#     db.session.commit()

#     # test get_investor

#     investor_url = url_for("api.investor_by_id", investor_id=investor.id)
#     rep = client.delete(investor_url, headers=admin_headers)
#     assert rep.status_code == 200
#     assert db.session.query(Investor).filter_by(id=investor.id).first() is None


def test_create_investor(client, db, admin_headers):
    # test bad data
    investors_url = url_for("api.investors")
    data = {"username": "created"}
    rep = client.post(investors_url, json=data, headers=admin_headers)
    assert rep.status_code == 400

    data["password"] = "admin"
    data["email"] = "create@mail.com"

    rep = client.post(investors_url, json=data, headers=admin_headers)
    assert rep.status_code == 201

    data = rep.get_json()
    investor = db.session.query(Investor).filter_by(id=data["investor"]["id"]).first()

    assert investor.username == "created"
    assert investor.email == "create@mail.com"


def test_get_all_investor(client, db, investor_factory, admin_headers):
    investors_url = url_for("api.investors")
    investors = investor_factory.create_batch(30)

    db.session.add_all(investors)
    db.session.commit()

    rep = client.get(investors_url, headers=admin_headers)
    assert rep.status_code == 200

    results = rep.get_json()
    for investor in investors:
        assert any(u["id"] == investor.id for u in results["results"])
