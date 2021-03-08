from flask import request
from RocketMaven.api.schemas import InvestorSchema
from RocketMaven.models import Investor


def get_all_investors(investor_id):
    schema = InvestorSchema()
    investor = Investor.query.get_or_404(investor_id)
    return {"investor": schema.dump(data)}


def update_investor(investor_id):
    schema = InvestorSchema(partial=True)

    investor = Investor.query.get_or_404(investor_id)
    investor = schema.load(request.json, instance=investor)

    db.session.commit()

    return {"msg": "investor updated", "investor": schema.dump(investor)}
