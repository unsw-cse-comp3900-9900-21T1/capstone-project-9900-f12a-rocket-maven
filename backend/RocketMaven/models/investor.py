from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, EmailType
from RocketMaven.models import Asset
from RocketMaven.extensions import db, pwd_context
from sqlalchemy.orm import relationship

# https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/


class Investor(db.Model):
    """Basic investor model"""

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(EmailType, unique=True, nullable=False)

    username = db.Column(db.String(80), unique=True, nullable=False)
    _password = db.Column("password", db.String(255), nullable=False)
    email_verified = db.Column(db.Boolean, default=False)

    admin_account = db.Column(db.Boolean, default=False)

    visibility = db.Column(db.Boolean, default=False)

    # TODO: validate the Country Type and return a 401? error

    country_of_residency = db.Column(CountryType, unique=False, nullable=False)

    join_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    first_name = db.Column(db.String(80), unique=False, nullable=True)
    last_name = db.Column(db.String(80), unique=False, nullable=True)
    date_of_birth = db.Column(db.Date, unique=False, nullable=True)
    gender = db.Column(db.String(80), unique=False, nullable=True)
    email_verified_code = db.Column(db.String(64), unique=True, nullable=True)

    # Portfolios owned, 1 to many (many side)
    # portfolios = db.relationship(
    #     "Portfolio", backref="investor", lazy=True, uselist=True
    # )
    portfolios = db.relationship("Portfolio", lazy="dynamic", back_populates="investor")

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        self._password = pwd_context.hash(value)

    def __repr__(self):
        return "<Investor %s>" % self.username

    # @validates("email")
    # def validate_email(self, key, email):
    #     assert '@' in email
    #     return email


# # Assets watched, many to many
# # Needs to be a model (although not recommended) to fit Marshmallow
class Watchlist(db.Model):
    asset = relationship("Asset", backref="asset_watchlist")
    asset_id = db.Column(
        db.String(80), db.ForeignKey("asset.ticker_symbol"), primary_key=True
    )
    price_high = db.Column(db.Float())  # ? or float
    price_low = db.Column(db.Float())  # ? or float
    investor_id = db.Column(db.Integer, db.ForeignKey("investor.id"), primary_key=True)
