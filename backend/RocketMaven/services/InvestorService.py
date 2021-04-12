from flask import request
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from RocketMaven.api.schemas import InvestorCreateSchema, InvestorSchema
from RocketMaven.auth import controllers as auth_controllers
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import Investor


def get_investor(investor_id):
    """ Returns the investor or 404 if not found """
    schema = InvestorSchema()
    data = Investor.query.get_or_404(investor_id)
    return {"investor": schema.dump(data)}


def handle_empty_date_of_birth():
    if "date_of_birth" in request.json and request.json["date_of_birth"]:
        request.json["date_of_birth"] = request.json["date_of_birth"].split("T", 1)[0]

        if len(request.json["date_of_birth"].strip()) == 0:
            request.json["date_of_birth"] = None
    else:
        request.json["date_of_birth"] = None


def update_investor(investor_id):

    investor = Investor.query.get_or_404(investor_id)
    try:
        schema = InvestorSchema(partial=True)

        handle_empty_date_of_birth()
        data = schema.load(request.json, instance=investor)
    except ValidationError as err:
        print(err)
        return {"msg": "Operation failed!", "errors": err.messages}, 422


    try:
        db.session.commit()

        return {"msg": "investor updated", "investor": schema.dump(data)}
    except Exception as err:
        print(err)
        return {"msg": "Operation failed!"}, 400


def get_investors():

    current_investor = Investor.query.filter_by(id=get_jwt_identity()).first()
    print(current_investor.admin_account)
    try:
        schema = InvestorSchema(many=True)
        if current_investor.admin_account:
            query = Investor.query
        else:
            query = Investor.query.filter_by(id=current_investor.id)
        return paginate(query, schema)

    except Exception:
        return {"msg": "Operation failed!"}


def create_investor():

    if get_jwt_identity():
        return {"msg": "investor not created, please log out first"}, 422
    try:
        schema = InvestorCreateSchema()
        handle_empty_date_of_birth()
        investor = schema.load(request.json)
    except ValidationError as e:
        print(e)
        return {"msg": "Operation failed!", "errors": e.messages}, 422
    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}, 400

    try:
        db.session.add(investor)
        db.session.commit()

        return {"msg": "investor created", "investor": schema.dump(investor)}, 201
    except Exception:
        return {"msg": "Operation failed", }, 422


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
    except Exception:
        add_to_response_data = {"msg_extended": "Cannot automatically login user"}
        return dict(response_data[0], **add_to_response_data), 201
