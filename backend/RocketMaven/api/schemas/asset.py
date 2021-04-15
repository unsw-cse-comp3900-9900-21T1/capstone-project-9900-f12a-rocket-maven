from RocketMaven.extensions import db, ma
from RocketMaven.models import Asset


class AssetSchema(ma.SQLAlchemyAutoSchema):
    """ A schema for the Asset model """

    # The id is a unique identifier, automatically generated
    id = ma.Int(dump_only=True)

    # The date/time the asset's price was last updated, implemented in business logic
    price_last_updated = ma.Date(dump_only=True)

    class Meta:
        model = Asset
        sqla_session = db.session
        load_instance = True
