from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, CurrencyType

from RocketMaven.extensions import db
from RocketMaven.models.portfolio_asset_holding import PortfolioAssetHolding
from sqlalchemy.orm import relationship
from sqlalchemy import select, func
import datetime


class Currency(db.Model):
    """Currency model to better store currency exchange data"""

    currency_from = db.Column(CurrencyType, primary_key=True)
    currency_to = db.Column(CurrencyType, primary_key=True)

    date = db.Column(db.DateTime, primary_key=True)
    value = db.Column(db.Float(), unique=False, nullable=True)

    def add_from_dict(m: dict, currency_from: str, currency_to: str):
        # Expected Date, Close items
        invert_close = None
        if m["Close"] == "null":
            m["Close"] = None
        if m["Close"]:
            m["Close"] = float(m["Close"])
            invert_close = 1 / float(m["Close"])
        entry_date = datetime.datetime.strptime(m["Date"], "%Y-%m-%d")
        new_entry = Currency(
            currency_from=currency_from,
            currency_to=currency_to,
            date=entry_date,
            value=m["Close"],
        )
        db.session.merge(new_entry)
        new_entry = Currency(
            currency_from=currency_to,
            currency_to=currency_from,
            date=entry_date,
            value=invert_close,
        )
        db.session.merge(new_entry)


class CurrencyUpdate(db.Model):
    """Currency update tracker to determine next update time"""

    currency_from = db.Column(CurrencyType, primary_key=True)
    currency_to = db.Column(CurrencyType, primary_key=True)

    last_updated = db.Column(db.DateTime)
