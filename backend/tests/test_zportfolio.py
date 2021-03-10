from flask import url_for

from RocketMaven.extensions import pwd_context
from RocketMaven.models import Asset, Investor, Portfolio, PortfolioEvent

from RocketMaven.services import ExampleFullSystemService


def test_create_user_and_portfolio(client, db, investor_factory):
    ExampleFullSystemService.populate_full_system(db)

    # import os
    # assert(portfolio.id == os.environ["DATABASE_URI"])
