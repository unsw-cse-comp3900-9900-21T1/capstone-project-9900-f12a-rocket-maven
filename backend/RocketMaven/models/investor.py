from sqlalchemy.ext.hybrid import hybrid_property

from RocketMaven.extensions import db, pwd_context


class Investor(db.Model):
    """Basic investor model"""

    id = db.Column(db.Integer, primary_key=True)
    investorname = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    _password = db.Column("password", db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=True)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        self._password = pwd_context.hash(value)

    def __repr__(self):
        return "<Investor %s>" % self.investorname