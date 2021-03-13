from RocketMaven.models import PortfolioAssetHolding
from RocketMaven.extensions import ma, db


class PortfolioAssetHoldingSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = PortfolioAssetHolding
        sqla_session = db.session
        load_instance = True
    