from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType

from RocketMaven.extensions import db, pwd_context


class Portfolio(db.Model):
    """Basic portfolio model"""

    id = db.Column(db.Integer, primary_key=True)

    tax_residency = db.Column(CountryType, unique=False, nullable=False)

    visibility = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(80), unique=False, nullable=True)

    # Competition portfolio = True, Regular portfolio = False
    competition_portfolio = db.Column(db.String(80), default=False)

    buying_power = db.Column(db.Float(), unique=False, nullable=True)

    # Portfolio owner, 1 to many (1 side)
    investor_id = db.Column(db.Integer, db.ForeignKey("investor.id"), nullable=False)
    investor = db.relationship("Investor")

    def __repr__(self):
        if self.competition_portfolio:
            return "<Competition Portfolio %s>" % self.name
        else:
            return "<Regular Portfolio %s>" % self.name
