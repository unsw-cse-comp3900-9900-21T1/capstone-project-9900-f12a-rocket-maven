from RocketMaven.models import Investor
from RocketMaven.extensions import ma, db


class InvestorSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    password = ma.String(load_only=True, required=True)

    class Meta:
        model = Investor
        sqla_session = db.session
        load_instance = True
        exclude = ("_password",)
