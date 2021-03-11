from RocketMaven.models import PortfolioEvent
from RocketMaven.extensions import ma, db


class PortfolioEventSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    # TODO date_created = ma.Int(dump_only=True)
    # password = ma.String(load_only=True, required=True)

    class Meta:
        model = PortfolioEvent
        sqla_session = db.session
        load_instance = True
        # exclude = ("id",)
