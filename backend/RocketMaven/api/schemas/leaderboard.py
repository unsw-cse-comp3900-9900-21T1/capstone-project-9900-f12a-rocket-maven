from RocketMaven.models import Portfolio
from RocketMaven.extensions import ma, db
from RocketMaven.models import Investor


class InvestorSmallSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    join_date = ma.Date(dump_only=True)

    class Meta:
        model = Investor
        sqla_session = db.session
        load_instance = True


class LeaderboardSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    investor = ma.Nested(InvestorSmallSchema, many=False, only=["id", "username", "first_name", "last_name"])
    # password = ma.String(load_only=True, required=True)

    class Meta:
        model = Portfolio
        sqla_session = db.session
        load_instance = True

    _realised_sum = ma.auto_field(data_key="realised_sum", attribute="realised_sum")
    _current_value_sum = ma.auto_field(
        data_key="current_value_sum", attribute="current_value_sum"
    )
    _purchase_value_sum = ma.auto_field(
        data_key="purchase_value_sum", attribute="purchase_value_sum"
    )
