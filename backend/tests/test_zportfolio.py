from flask import url_for

from RocketMaven.extensions import pwd_context
from RocketMaven.models import Asset, Investor, Portfolio, PortfolioEvent


def test_create_user_and_portfolio(client, db, investor_factory):
    pass
    user = Investor(
        username="admin_portfolio",
        email="admin_portfolio@admin.com",
        password="admin",
        country_of_residency="AU",
    )

    db.session.add(user)
    db.session.commit()

    portfolio = Portfolio(
        tax_residency="AU",
        name="My First Portfolio!",
        description="Growth stocks in a sell-off?",
        competition_portfolio=False,
        buying_power=None,
        investor_id=63456345,  # user.id,
    )
    db.session.add(portfolio)
    db.session.commit()

    asset = Asset(
        ticker_symbol="VIRT:A",
        name="Virtual Holding A",
        industry="Virtual",
        current_price=100,
        data_source="VIRTUAL",
        country="AU",
        currency="AUD",
    )

    db.session.add(asset)
    db.session.commit()

    portfolio_event = PortfolioEvent(
        units=20,
        buy_action=True,
        fees=15,
        price_before_fees=2000,
        final_units=20,
        final_price=2015,
        note="Hi!",
        asset_id="VIRT:A",
        portfolio_id=5,
    )

    db.session.add(portfolio_event)
    db.session.commit()

    # import os
    # assert(portfolio.id == os.environ["DATABASE_URI"])
