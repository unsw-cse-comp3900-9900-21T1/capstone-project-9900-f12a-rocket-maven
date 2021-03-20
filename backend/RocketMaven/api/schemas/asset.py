from RocketMaven.models import Asset
from RocketMaven.extensions import ma, db


class AssetSchema(ma.SQLAlchemyAutoSchema):

    id = ma.Int(dump_only=True)
    price_last_updated = ma.Date(dump_only=True)
    class Meta:
        model = Asset
        sqla_session = db.session
        load_instance = True