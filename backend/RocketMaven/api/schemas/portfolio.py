from RocketMaven.models import Portfolio
from RocketMaven.extensions import ma, db


class PortfolioSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    buying_power = ma.Float(dump_only=True)
    # password = ma.String(load_only=True, required=True)

    class Meta:
        model = Portfolio
        sqla_session = db.session
        load_instance = True
        # exclude = ("",)
