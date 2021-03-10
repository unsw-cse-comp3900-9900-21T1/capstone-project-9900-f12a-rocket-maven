from flask import request
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.models import Investor
from RocketMaven.extensions import db
from RocketMaven.commons.pagination import paginate
from flask_jwt_extended import get_jwt_identity


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
    try:
        if not get_jwt_identity():
            schema = InvestorSchema()
            investor = schema.load(request.json)

            db.session.add(investor)
            db.session.commit()

            return {"msg": "investor created", "investor": schema.dump(investor)}, 201
        else:
            return {"msg": "investor not created, please log out first"}, 201

    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}
