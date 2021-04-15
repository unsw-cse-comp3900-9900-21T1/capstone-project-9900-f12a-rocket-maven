from RocketMaven.models import PortfolioEvent
from RocketMaven.extensions import ma, db


class PortfolioEventSchema(ma.SQLAlchemyAutoSchema):
    """ A schema for a portfolio event (i.e. buying/selling an asset) """

    # The id is a unique identifier, automatically generated
    id = ma.Int(dump_only=True)

    # The portfolio_id links the portfolio the event belongs to
    portfolio_id = ma.Int(dump_only=True)

    # The asset id links the asset the event belongs to
    asset_id = ma.String(required=True)

    class Meta:
        model = PortfolioEvent
        sqla_session = db.session
        load_instance = True
        exclude = ("dynamic_after_FIFO_units",)

    asset_id = ma.auto_field()
