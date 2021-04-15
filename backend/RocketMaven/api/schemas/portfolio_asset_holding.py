from RocketMaven.models import PortfolioAssetHolding
from RocketMaven.extensions import ma, db


class PortfolioAssetHoldingSchema(ma.SQLAlchemyAutoSchema):
    """  A schema for a asset holding in a portfolio """

    class Meta:
        model = PortfolioAssetHolding
        sqla_session = db.session
        load_instance = True

    _unrealised_units = ma.auto_field(data_key="unrealised_units", attribute="unrealised_units")
    _current_value = ma.auto_field(data_key="current_value", attribute="current_value")
    _purchase_value = ma.auto_field(data_key="purchase_value", attribute="purchase_value")

    asset_id = ma.auto_field()
    portfolio_id = ma.auto_field()
    market_price = ma.auto_field()
