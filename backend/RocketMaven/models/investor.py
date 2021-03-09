from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, EmailType

from RocketMaven.extensions import db, pwd_context


class Investor(db.Model):
    """Basic investor model"""

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(EmailType, unique=True, nullable=False)

    username = db.Column(db.String(80), unique=True, nullable=False)
    _password = db.Column("password", db.String(255), nullable=False)
    email_verified = db.Column(db.Boolean, default=False)

    visibility = db.Column(db.Boolean, default=False)

    country_of_residency = db.Column(CountryType, unique=False, nullable=False)

    join_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    first_name = db.Column(db.String(80), unique=False, nullable=True)
    last_name = db.Column(db.String(80), unique=False, nullable=True)
    date_of_birth = db.Column(db.Date, unique=False, nullable=True)
    gender = db.Column(db.String(80), unique=False, nullable=True)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        self._password = pwd_context.hash(value)

    def __repr__(self):
        return "<Investor %s>" % self.username
