from RocketMaven.models import PortfolioEvent
from RocketMaven.extensions import ma, db


class PortfolioEventSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    portfolio_id = ma.Int(dump_only=True)
    event_date = ma.DateTime(dump_only=True)
    asset_id = ma.String(required=True)

    class Meta:
        model = PortfolioEvent
        sqla_session = db.session
        load_instance = True
        exclude = ("dynamic_after_FIFO_units",)

    asset_id = ma.auto_field()
