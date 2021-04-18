from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, CurrencyType

from RocketMaven.extensions import db
from RocketMaven.models.portfolio_asset_holding import PortfolioAssetHolding
from sqlalchemy.orm import relationship
from sqlalchemy import select, func


class Currency(db.Model):
    """Currency model to better store currency exchange data"""

    currency_from = db.Column(db.Integer, primary_key=True)
    currency_to = db.Column(db.Integer, primary_key=True)

    date = db.Column(db.DateTime, primary_key=True)
    value = db.Column(db.Float(), unique=False, nullable=True)


class CurrencyUpdate(db.Model):
    """Currency update tracker to determine next update time"""

    currency_from = db.Column(db.Integer, primary_key=True)
    currency_to = db.Column(db.Integer, primary_key=True)

    last_updated = db.Column(db.DateTime, default=db.func.current_timestamp())
