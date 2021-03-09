from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, EmailType

from RocketMaven.extensions import db, pwd_context


class Asset(db.Model):
    """Basic asset model"""

    ticker_symbol = db.Column(db.String(80), primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    industry = db.Column(db.String(80), unique=False, nullable=True)

    # If an asset has no price: null it.
    current_price = db.Column(db.Float(), unique=False, nullable=False)

    data_source = db.Column(db.String(1024), unique=False, nullable=False)

    country = db.Column(CountryType, unique=False, nullable=True)
    currency = db.Column(db.String(80), unique=False, nullable=True)

    def __repr__(self):
        return "<Asset %s>" % self.ticker_symbol
