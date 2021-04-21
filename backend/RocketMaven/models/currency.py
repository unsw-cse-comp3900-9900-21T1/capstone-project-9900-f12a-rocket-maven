import datetime

from RocketMaven.extensions import db
from sqlalchemy_utils import CurrencyType


class Currency(db.Model):
    """Currency model to better store currency exchange data"""

    __tablename__ = "currency"

    code = db.Column(CurrencyType, primary_key=True)
    name = db.Column(db.Text)


class CurrencyHistory(db.Model):
    """Currency model to better store currency exchange data"""

    currency_from = db.Column(
        CurrencyType, db.ForeignKey("currency.code"), primary_key=True
    )
    currency_to = db.Column(
        CurrencyType, db.ForeignKey("currency.code"), primary_key=True
    )

    date = db.Column(db.DateTime, primary_key=True)
    value = db.Column(db.Float(), unique=False, nullable=True)

    def add_from_dict(
        m: dict, currency_from: str, currency_to: str, merge_mode: bool = True
    ):
        # Expected Date, Close items
        invert_close = None
        if m["Close"] == "null":
            m["Close"] = None
        if m["Close"]:
            m["Close"] = float(m["Close"])
            invert_close = 1 / float(m["Close"])
        entry_date = datetime.datetime.strptime(m["Date"], "%Y-%m-%d")
        new_entry = CurrencyHistory(
            currency_from=currency_from,
            currency_to=currency_to,
            date=entry_date,
            value=m["Close"],
        )
        if merge_mode:
            db.session.merge(new_entry)
        else:
            db.session.add(new_entry)
        new_entry = CurrencyHistory(
            currency_from=currency_to,
            currency_to=currency_from,
            date=entry_date,
            value=invert_close,
        )
        if merge_mode:
            db.session.merge(new_entry)
        else:
            db.session.add(new_entry)


class CurrencyUpdate(db.Model):
    """Currency update tracker to determine next update time"""

    currency_from = db.Column(
        CurrencyType, db.ForeignKey("currency.code"), primary_key=True
    )
    currency_to = db.Column(
        CurrencyType, db.ForeignKey("currency.code"), primary_key=True
    )

    last_updated = db.Column(db.DateTime)
