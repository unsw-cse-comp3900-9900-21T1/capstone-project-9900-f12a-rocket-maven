from sqlalchemy.ext.hybrid import hybrid_property

# from sqlalchemy.orm import column_property
from RocketMaven.extensions import db, pwd_context
from RocketMaven.models.asset import Asset
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship, backref


class PortfolioAssetHolding(db.Model):
    """A single consolidated view of an asset in a portfolio"""

    asset_id = db.Column(
        db.String(80),
        db.ForeignKey("asset.ticker_symbol"),
        primary_key=True,
        nullable=False,
    )
    asset = relationship("Asset", backref="asset")

    portfolio_id = db.Column(
        db.Integer, db.ForeignKey("portfolio.id"), primary_key=True, nullable=False
    )

    last_updated = db.Column(db.DateTime, default=db.func.current_timestamp())
    available_units = db.Column(db.Float(), unique=False, nullable=False)
    average_price = db.Column(db.Float(), unique=False, nullable=False)

    realised_total = db.Column(db.Float(), unique=False, nullable=False)

    latest_note = db.Column(db.String(1024), unique=False, nullable=True)

    def __repr__(self):
        return "<PortfolioAssetHolding %s, %s>" % (self.asset_id, self.portfolio_id)

    market_price = association_proxy("asset", "current_price")

    @hybrid_property
    def current_value(self):
        return self.market_price * self.available_units

    _unrealised_units = db.Column(db.Float(), nullable=True)

    @hybrid_property
    def unrealised_units(self):
        return (self.market_price * self.available_units) - (
            self.average_price * self.available_units
        )
