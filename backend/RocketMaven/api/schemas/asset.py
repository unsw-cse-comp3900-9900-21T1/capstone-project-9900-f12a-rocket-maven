from RocketMaven.models import Asset
from RocketMaven.extensions import ma, db


class AssetSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Asset
        sqla_session = db.session
        load_instance = True