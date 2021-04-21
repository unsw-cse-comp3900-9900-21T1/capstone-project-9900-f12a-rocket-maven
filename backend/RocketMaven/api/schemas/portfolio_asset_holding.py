from RocketMaven.api.schemas import AssetSchema
from RocketMaven.extensions import db, ma
from RocketMaven.models import PortfolioAssetHolding


class PortfolioAssetHoldingSchema(ma.SQLAlchemyAutoSchema):
    """  A schema for a asset holding in a portfolio """

    asset = ma.Nested(AssetSchema, many=False)

    class Meta:
        model = PortfolioAssetHolding
        sqla_session = db.session
        load_instance = True

    _market_price = ma.auto_field(data_key="market_price", attribute="market_price")
    _unrealised_units = ma.auto_field(
        data_key="unrealised_units", attribute="unrealised_units"
    )
    _current_value = ma.auto_field(data_key="current_value", attribute="current_value")
    _purchase_value = ma.auto_field(
        data_key="purchase_value", attribute="purchase_value"
    )
    asset_id = ma.auto_field()
    portfolio_id = ma.auto_field()
