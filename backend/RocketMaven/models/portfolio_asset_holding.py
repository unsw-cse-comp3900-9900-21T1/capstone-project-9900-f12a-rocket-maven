from sqlalchemy.ext.hybrid import hybrid_property

# from sqlalchemy.orm import column_property
from RocketMaven.extensions import db, pwd_context


class PortfolioAssetHolding(db.Model):
    """A single consolidated view of an asset in a portfolio"""

    asset_id = db.Column(
        db.String(80),
        db.ForeignKey("asset.ticker_symbol"),
        primary_key=True,
        nullable=False,
    )

    portfolio_id = db.Column(
        db.Integer, db.ForeignKey("portfolio.id"), primary_key=True, nullable=False
    )

    market_price = db.Column(db.Float(), unique=False, nullable=False)

    last_updated = db.Column(db.DateTime, default=db.func.current_timestamp())
    available_units = db.Column(db.Float(), unique=False, nullable=False)
    average_price = db.Column(db.Float(), unique=False, nullable=False)

    realised_total = db.Column(db.Float(), unique=False, nullable=False)

    latest_note = db.Column(db.String(1024), unique=False, nullable=True)

    def __repr__(self):
        return "<PortfolioAssetHolding %s, %s>" % (self.asset_id, self.portfolio_id)

    # current_value = column_property(market_price * available_units)
    # unrealised_units = column_property((market_price * available_units) - (average_price * available_units))

    @hybrid_property
    def current_value(self):
        return market_price * available_units

    @hybrid_property
    def unrealised_units(self):
        return (market_price * available_units) - (average_price * available_units)
