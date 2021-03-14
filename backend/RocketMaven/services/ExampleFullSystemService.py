from RocketMaven.models import Asset, Investor, Portfolio, PortfolioEvent
import datetime


def create_asset_event_with_current_price(port_data, asset_cba, db):
    portfolio_event = PortfolioEvent(**port_data)

    db.session.add(portfolio_event)
    db.session.commit()

    asset_cba.current_price = port_data["price_per_share"]
    db.session.commit()

    portfolio_event.update_portfolio_asset_holding()


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

        asset = Asset(
            ticker_symbol="CBA:AX",
            name="Commonwealth Bank of Australia",
            industry="Actual",
            current_price=86.49,
            data_source="Yahoo Finance",
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

        asset_cba = Asset(
            ticker_symbol="VIRT:CBA",
            name="Virtual Holding CBA",
            industry="Virtual",
            current_price=100,
            data_source="VIRTUAL",
            country="AU",
            currency="AUD",
        )
        db.session.add(asset_cba)
        db.session.commit()

        create_asset_event_with_current_price(
            dict(
                units=100,
                add_action=True,
                fees=15,
                price_per_share=80,
                note="I think this stock has growth potential",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 1),
            ),
            asset_cba,
            db,
        )

        create_asset_event_with_current_price(
            dict(
                units=100,
                add_action=True,
                fees=15,
                price_per_share=90,
                note="Good stock",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 3),
            ),
            asset_cba,
            db,
        )

        create_asset_event_with_current_price(
            dict(
                units=150,
                add_action=True,
                fees=15,
                price_per_share=100,
                note="Good stock",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 5),
            ),
            asset_cba,
            db,
        )

        create_asset_event_with_current_price(
            dict(
                units=100,
                add_action=False,
                fees=15,
                price_per_share=105,
                note="Taking profits, I think I should sell more later",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 7),
            ),
            asset_cba,
            db,
        )

        create_asset_event_with_current_price(
            dict(
                units=130,
                add_action=False,
                fees=15,
                price_per_share=110,
                note="Taking more profits",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 9),
            ),
            asset_cba,
            db,
        )

        create_asset_event_with_current_price(
            dict(
                units=200,
                add_action=True,
                fees=15,
                price_per_share=120,
                note="FOMO buy-in, I should not have sold",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 11),
            ),
            asset_cba,
            db,
        )

        create_asset_event_with_current_price(
            dict(
                units=200,
                add_action=False,
                fees=15,
                price_per_share=70,
                note="Just got to cut losses, why would there be a sell-off in a bank stock anyways?",
                asset_id="VIRT:CBA",
                portfolio_id=portfolio.id,
                event_date=datetime.date(2020, 1, 13),
            ),
            asset_cba,
            db,
        )
