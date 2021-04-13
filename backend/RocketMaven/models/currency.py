from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, CurrencyType

from RocketMaven.extensions import db
from RocketMaven.models.portfolio_asset_holding import PortfolioAssetHolding
from sqlalchemy.orm import relationship
from sqlalchemy import select, func


class CurrencyExchange(db.Model):
    """Currency model to better store currency exchange data"""

    id = db.Column(db.Integer, primary_key=True)

    tax_residency = db.Column(CountryType, unique=False, nullable=False)
    currency = db.Column(CurrencyType, unique=False, nullable=False)

    public_portfolio = db.Column(db.Boolean, default=False)
    deleted = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(80), unique=False, nullable=True)
