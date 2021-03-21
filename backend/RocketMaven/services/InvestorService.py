from flask import request
import sqlite3
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.models import Investor
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate
from RocketMaven.auth import controllers as auth_controllers
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError

def get_investor(investor_id):
    try:
        schema = InvestorSchema()
        data = Investor.query.get_or_404(investor_id)
        return {"investor": schema.dump(data)}
    except:
        return {"msg": "Operation failed!"}


def update_investor(investor_id):
    try:
        schema = InvestorSchema(partial=True)

        investor = Investor.query.get_or_404(investor_id)
        data = schema.load(request.json, instance=investor)

        db.session.commit()

        return {"msg": "investor updated", "investor": schema.dump(data)}

    except:
        return {"msg": "Operation failed!"}


def get_investors():

    current_investor = Investor.query.filter_by(id=get_jwt_identity()).first()

    try:
        schema = InvestorSchema(many=True)
        query = Investor.query.filter_by(id=current_investor.id)
        if current_investor.admin_account:
            query = Investor.query
        return paginate(query, schema)

    except:
        return {"msg": "Operation failed!"}


def create_investor():

    if get_jwt_identity():
        return {
            "msg": "investor not created, please log out first"
        }, 422
    try:
        schema = InvestorSchema()
        investor = schema.load(request.json)
    except ValidationError as e:
        print(e)
        return {
            "msg": "Operation failed!",
            "errors": e.messages
        }, 422

    try:
        db.session.add(investor)
        db.session.commit()

        return {
            "msg": "investor created", "investor": schema.dump(investor)
        }, 201
    except Exception:
        return {
            "msg": "Operation failed",
        }, 422
        


def automatically_login_user_after_creation(response_data):
    try:
        if response_data[1] == 201:
            add_to_response_data = auth_controllers.login()
            add_to_response_data_2 = {
                "msg_extended": "Able to automatically login user"
            }
            add_to_response_data = dict(
                response_data[0], **add_to_response_data[0].get_json()
            )
            add_to_response_data.update(add_to_response_data_2)
            return add_to_response_data, 201
        raise Exception("account not successfully created")
    except Exception as e:
        add_to_response_data = {"msg_extended": "Cannot automatically login user"}
        return dict(response_data[0], **add_to_response_data), 201