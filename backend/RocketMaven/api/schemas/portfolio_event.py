from RocketMaven.models import PortfolioEvent
from RocketMaven.extensions import ma, db
from marshmallow import validate


class PortfolioEventSchema(ma.SQLAlchemyAutoSchema):
    """ A schema for a portfolio event (i.e. buying/selling an asset) """

    # The id is a unique identifier, automatically generated
    id = ma.Int(dump_only=True)

    # The portfolio_id links the portfolio the event belongs to
    portfolio_id = ma.Int(dump_only=True)

    competition_portfolio = ma.Boolean(dump_only=True)

    realised_snapshot = ma.Float(dump_only=True)
    available_snapshot = ma.Float(dump_only=True)
    tax_full_snapshot = ma.String(dump_only=True)

    units = ma.Float(validate=validate.Range(min=0, min_inclusive=False))

    # The asset id links the asset the event belongs to
    asset_id = ma.String(required=True)

    class Meta:
        model = PortfolioEvent
        sqla_session = db.session
        load_instance = True
        # exclude = ("dynamic_after_FIFO_units",)

    asset_id = ma.auto_field()


class PortfolioEventUpdateSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int()
    exchange_rate = ma.Float(validate=validate.Range(min=0, min_inclusive=False))
    units = ma.Float(validate=validate.Range(min=0, min_inclusive=False))
    price_per_share = ma.Float(validate=validate.Range(min=0, min_inclusive=False))

    class Meta:
        model = PortfolioEvent
        sqla_session = db.session
        load_instance = True
        fields = (
            "id",
            "note",
            "exchange_rate",
            "fees",
            "price_per_share",
            "units",
        )
