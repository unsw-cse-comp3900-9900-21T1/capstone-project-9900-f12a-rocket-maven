from RocketMaven.models import Asset, Investor, Portfolio, PortfolioEvent


def populate_full_system(db):

    test_user = db.session.query(Investor).filter_by(username="temp_admin").first()

    if not test_user:
        user = Investor(
            username="temp_admin",
            email="admin@mail.com",
            admin_account=True,
            password="WjjTeWGdylJkH2Pq",
            email_verified=True,
            country_of_residency="AU",
        )
        db.session.add(user)
        db.session.commit()

    test_user = db.session.query(Investor).filter_by(username="admin_portfolio").first()

    if not test_user:
        user = Investor(
            username="admin_portfolio",
            email="admin_portfolio@admin.com",
            admin_account=True,
            password="admin_P4$$w0rd!",
            country_of_residency="AU",
        )

        db.session.add(user)
        db.session.commit()

    test_portfolio = (
        db.session.query(Portfolio).filter_by(name="My First Portfolio!").first()
    )

    if not test_portfolio:
        portfolio = Portfolio(
            tax_residency="AU",
            name="My First Portfolio!",
            description="Growth stocks in a sell-off?",
            competition_portfolio=False,
            buying_power=None,
            investor_id=user.id,
        )
        db.session.add(portfolio)
        db.session.commit()

    test_asset = db.session.query(Asset).filter_by(ticker_symbol="VIRT:A").first()

    if not test_asset:

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

    test_portfolio_event = (
        db.session.query(PortfolioEvent)
        .filter_by(asset_id="VIRT:A", portfolio_id=portfolio.id)
        .first()
    )

    if not test_portfolio_event:

        portfolio_event = PortfolioEvent(
            units=20,
            add_action=True,
            fees=15,
            price_before_fees=2000,
            final_units=20,
            final_price=2015,
            note="Hi!",
            asset_id="VIRT:A",
            portfolio_id=portfolio.id,
        )

        db.session.add(portfolio_event)
        db.session.commit()
