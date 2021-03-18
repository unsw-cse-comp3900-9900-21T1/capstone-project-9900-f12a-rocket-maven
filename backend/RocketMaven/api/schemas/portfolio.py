from RocketMaven.models import Portfolio
from RocketMaven.api.schemas.portfolio_asset_holding import PortfolioAssetHoldingSchema
from RocketMaven.extensions import ma, db


class PortfolioSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    buying_power = ma.Float(dump_only=True)
    competition_portfolio = ma.Bool()
    # password = ma.String(load_only=True, required=True)
    portfolio_asset_holding = ma.Nested(PortfolioAssetHoldingSchema, many=True)

    class Meta:
        model = Portfolio
        sqla_session = db.session
        load_instance = True
        # exclude = ("id",)

    _realised_sum = ma.auto_field(data_key="realised_sum", attribute="realised_sum")
    _current_value_sum = ma.auto_field(
        data_key="current_value_sum", attribute="current_value_sum"
    )
    _purchase_value_sum = ma.auto_field(
        data_key="purchase_value_sum", attribute="purchase_value_sum"
    )
