from sqlalchemy.ext.hybrid import hybrid_property

from RocketMaven.extensions import db, pwd_context


class PortfolioEvent(db.Model):
    """Basic portfolio tracker model"""

    id = db.Column(db.Integer, primary_key=True)

    units = db.Column(db.Float(), unique=False, nullable=False)

    # Add (competition: buy) = True, Remove (competition: sell) = False
    add_action = db.Column(db.Boolean, default=False)

    fees = db.Column(db.Float(), unique=False, nullable=False)
    price_before_fees = db.Column(db.Float(), unique=False, nullable=False)

    final_units = db.Column(db.Float(), unique=False, nullable=False)
    final_price = db.Column(db.Float(), unique=False, nullable=False)

    note = db.Column(db.String(1024), unique=False, nullable=True)

    event_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    asset_id = db.Column(
        db.String(80),
        db.ForeignKey("asset.ticker_symbol"),
        primary_key=False,
        nullable=False,
    )
    portfolio_id = db.Column(
        db.Integer, db.ForeignKey("portfolio.id"), primary_key=False, nullable=False
    )

    def __repr__(self):
        return "<PortfolioTracks %s>" % self.username
