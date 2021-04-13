import json

import pytest
from flask import url_for


def test_get_explore(client):
    # test 400
    url = url_for("api.explore")
    resp = client.get(url) 
    assert resp.status_code == 400

    # test 200
    url = url_for("api.explore")
    resp = client.get(url, query_string={"q": "B"}) 
    assert resp.status_code == 200
    
