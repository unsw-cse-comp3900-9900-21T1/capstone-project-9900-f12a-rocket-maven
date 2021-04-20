import json

import pytest
from flask import url_for


def test_get_investor_list(client, normal_headers):
    # test 401
    url = url_for("api.investors")
    resp = client.get(url)
    assert resp.status_code == 401
    
    # test 200
    url = url_for("api.investors")
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 200
    

def test_get_investor(client, normal_user, normal_headers):
    # test 401
    url = url_for("api.investor_by_id", investor_id=normal_user.id)
    resp = client.get(url)
    assert resp.status_code == 401

    # test 401 (changed from 404)
    url = url_for("api.investor_by_id", investor_id=2000)
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 401
    
    # test 200
    url = url_for("api.investor_by_id", investor_id=normal_user.id)
    resp = client.get(url, headers=normal_headers)
    assert resp.status_code == 200


def test_put_investor(client, normal_user, normal_headers):
    # test 401
    url = url_for("api.investor_by_id", investor_id=normal_user.id)
    resp = client.put(url)
    assert resp.status_code == 401

    # test 401 (changed from 404)
    url = url_for("api.investor_by_id", investor_id=2000)
    resp = client.put(url, headers=normal_headers)
    assert resp.status_code == 401
    
    # test 400
    url = url_for("api.investor_by_id", investor_id=normal_user.id)
    resp = client.put(url, headers=normal_headers)
    assert resp.status_code == 400

    # test 422
    url = url_for("api.investor_by_id", investor_id=normal_user.id)
    resp = client.put(url, headers=normal_headers, data=json.dumps(
        {
            "country_of_residency": "string",
            
        }
    ))
    assert resp.status_code == 422

    # test 200
    url = url_for("api.investor_by_id", investor_id=normal_user.id)
    resp = client.put(url, headers=normal_headers, data=json.dumps(
        {
            "country_of_residency": "US",
            
        }
    ))
    assert resp.status_code == 200



def test_pw_reset(client, normal_user, normal_headers):
    
    # test 400
    url = url_for("api.pw_reset")
    resp = client.post(url)
    assert resp.status_code == 400

    # test 400 - passwords don't match
    # url = url_for("api.pw_reset")
    # resp = client.post(url, json=json.dumps(
    #     {
    #         "evc": "",
    #         "password": "123",
    #         "confirmation": "234"
    #     }
    # ))
    # print(resp.get_json())
    # assert resp.status_code == 400

    # # test 404 - unknown verification code
    # url = url_for("api.pw_reset")
    # resp = client.post(url, json=json.dumps(
    #     {
    #         "evc": "234",
    #         "password": "123",
    #         "confirmation": "123"
    #     }
    # ))
    # print(resp.get_json())
    # assert resp.status_code == 404

    # test 200
    # TODO
