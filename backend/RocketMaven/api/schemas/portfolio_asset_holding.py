from RocketMaven.models import PortfolioAssetHolding
from RocketMaven.extensions import ma, db


class PortfolioAssetHoldingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PortfolioAssetHolding
        sqla_session = db.session
        load_instance = True

    _unrealised_units = ma.auto_field(
        data_key="unrealised_units", attribute="unrealised_units"
    )
    asset_id = ma.auto_field()
    portfolio_id = ma.auto_field()
    market_price = ma.auto_field()
