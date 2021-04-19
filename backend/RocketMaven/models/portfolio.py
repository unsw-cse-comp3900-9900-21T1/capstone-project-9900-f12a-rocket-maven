from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import CountryType, CurrencyType

from RocketMaven.extensions import db
from RocketMaven.models.portfolio_asset_holding import PortfolioAssetHolding
from RocketMaven.models.asset import Asset
from sqlalchemy.orm import relationship
from sqlalchemy import select, func
from sqlalchemy.sql.functions import coalesce


class Portfolio(db.Model):
    """Basic portfolio model"""

    id = db.Column(db.Integer, primary_key=True)

    tax_residency = db.Column(CountryType, unique=False, nullable=False)
    currency = db.Column(
        CurrencyType, db.ForeignKey("currency.code"), unique=False, nullable=False
    )

    public_portfolio = db.Column(db.Boolean, default=False)
    deleted = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    name = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(80), unique=False, nullable=True)

    # Competition portfolio = True, Regular portfolio = False
    competition_portfolio = db.Column(db.Boolean, default=False)

    buying_power = db.Column(db.Float(), unique=False, nullable=True, default=10000)

    view_count = db.Column(db.Float(), unique=False, nullable=False, default=0)

    # Portfolio owner, 1 to many (1 side)
    investor = db.relationship("Investor")
    investor_id = db.Column(db.Integer, db.ForeignKey("investor.id"), nullable=False)

    def __repr__(self):
        if self.competition_portfolio:
            return "<Competition Portfolio %s>" % self.name
        else:
            return "<Regular Portfolio %s>" % self.name

    portfolio_asset_holding = relationship("PortfolioAssetHolding", backref="subject")

    rank = db.Column(db.Integer, nullable=True)

    _competition_score = db.Column(db.Float(), nullable=True)

    # competition_score is the total holding values + total realised value + current buying power
    @hybrid_property
    def competition_score(self):
        return (
            sum(
                acc.realised_total + acc.current_value
                for acc in self.portfolio_asset_holding
            )
            + self.buying_power
        )

    @competition_score.expression
    def competition_score(cls):
        return (
            coalesce(func.sum(PortfolioAssetHolding.realised_total), 0)
            + coalesce(
                func.sum(
                    PortfolioAssetHolding.available_units * Asset.current_price,
                ),
                0,
            )
            + cls.buying_power
        )

    # realised_sum is the sum of the realised units of all holdings
    _realised_sum = db.Column(db.Float(), nullable=True)

    @hybrid_property
    def realised_sum(self):
        return sum(acc.realised_total for acc in self.portfolio_asset_holding)

    @realised_sum.expression
    def realised_sum(cls):
        return (
            select([func.sum(PortfolioAssetHolding.realised_total)])
            .where(PortfolioAssetHolding.portfolio_id == cls.id)
            .label("realised_total")
        )

    _purchase_value_sum = db.Column(db.Float(), nullable=True)

    # purchase_value_sum is the sum of the purechase value of all holdings
    @hybrid_property
    def purchase_value_sum(self):
        return sum(acc.purchase_value for acc in self.portfolio_asset_holding)

    @purchase_value_sum.expression
    def purchase_value_sum(cls):
        return (
            select([func.sum(PortfolioAssetHolding.purchase_value)])
            .where(PortfolioAssetHolding.portfolio_id == cls.id)
            .label("purchase_value")
        )

    _current_value_sum = db.Column(db.Float(), nullable=True)

    # current_value_sum is the sum of the current value (calculated from the asset's current price) of all holdings
    @hybrid_property
    def current_value_sum(self):
        return sum(acc.current_value for acc in self.portfolio_asset_holding)

    @current_value_sum.expression
    def current_value_sum(cls):
        return (
            select([func.sum(PortfolioAssetHolding.current_value)])
            .where(PortfolioAssetHolding.portfolio_id == cls.id)
            .label("current_value")
        )
