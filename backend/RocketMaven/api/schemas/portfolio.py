from RocketMaven.api.schemas.investor import InvestorSchema
from RocketMaven.api.schemas.portfolio_asset_holding import PortfolioAssetHoldingSchema
from RocketMaven.extensions import db, ma
from RocketMaven.models import Portfolio


class PortfolioSchema(ma.SQLAlchemyAutoSchema):
    """ A schema for an investor's portfolio """

    # The id is a unique identifier, automatically generated
    id = ma.Int(dump_only=True)

    # The buying power in the portfolio, implemented in business logic
    buying_power = ma.Float(dump_only=True)

    # True if this portfolio is a competition portfolio
    competition_portfolio = ma.Bool()

    # Assets that are part of the portfolio
    portfolio_asset_holding = ma.Nested(PortfolioAssetHoldingSchema, many=True)

    class Meta:
        model = Portfolio
        sqla_session = db.session
        load_instance = True
        # exclude = ("id",)

    _realised_sum = ma.auto_field(data_key="realised_sum", attribute="realised_sum")
    _current_value_sum = ma.auto_field(
        data_key="current_value_sum", attribute="current_value_sum"
    )
    _purchase_value_sum = ma.auto_field(
        data_key="purchase_value_sum", attribute="purchase_value_sum"
    )


class PublicPortfolioSchema(PortfolioSchema):
    """ A schema for an investor's public portfolio """

    investor = ma.Nested(InvestorSchema, many=False, only=["username"])
