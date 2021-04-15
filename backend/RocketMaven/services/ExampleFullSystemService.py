from RocketMaven.models import (
    Asset,
    Investor,
    Portfolio,
    PortfolioEvent,
    PortfolioAssetHolding,
)
from RocketMaven.services import AssetService, WatchlistService
import datetime


def create_asset_event_with_current_price(
    port_data, asset_cba, db, expected_test=False
):
    portfolio_event = PortfolioEvent(**port_data)

    asset_cba.current_price = port_data["price_per_share"]
    db.session.commit()

    portfolio_event.update_portfolio_asset_holding()
    db.session.commit()

    cba_details = PortfolioAssetHolding.query.filter_by(
        portfolio_id=portfolio_event.portfolio_id, asset_id="VIRT:CBA"
    ).first()

    if expected_test:
        assert expected_test[0] == cba_details.realised_total
        assert expected_test[1] == cba_details.unrealised_units
        assert expected_test[2] == cba_details.current_value
        assert expected_test[3] == cba_details.average_price


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

    test_user = db.session.query(Investor).filter_by(username="rocket_maven").first()

    if not test_user:
        user = Investor(
            username="rocket_maven",
            email="rocket_maven@example.com",
            admin_account=True,
            password="rocket_maven_P4$$w0rd!",
            country_of_residency="AU",
        )

        db.session.add(user)
        db.session.commit()

    portfolio = Portfolio(
        currency="AUD",
        tax_residency="AU",
        name="My First Portfolio!",
        description="Seeing if I should invest or not",
        competition_portfolio=False,
        buying_power=None,
        investor_id=user.id,
    )
    db.session.add(portfolio)
    db.session.commit()

    portfolio2 = Portfolio(
        currency="AUD",
        tax_residency="AU",
        name="My Second Portfolio!",
        description="Seeing if I should invest or not",
        competition_portfolio=False,
        public_portfolio=True,
        buying_power=None,
        investor_id=user.id,
        deleted=True,
    )
    db.session.add(portfolio2)
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

    asset = Asset(
        ticker_symbol="ASX:CBA",
        name="Commonwealth Bank of Australia",
        industry="Banking",
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

        # AMP
        asset_amp = Asset(
            ticker_symbol="ASX:AMP",
            name="AMP Limited",
            industry="Finance",
            current_price=100,
            data_source="Yahoo",
            country="AU",
            currency="AUD",
        )
        db.session.add(asset_amp)
        db.session.commit()

        # AAPL
        asset_aapl = Asset(
            ticker_symbol="NASDAQ:AAPL",
            name="Apple Inc.",
            industry="Technology",
            current_price=121,
            data_source="Yahoo",
            country="US",
            currency="USD",
        )
        db.session.add(asset_aapl)
        db.session.commit()

        portfolio_event = PortfolioEvent(
            units=10,
            add_action=True,
            fees=15,
            price_per_share=143,
            exchange_rate=1.0,
            note="",
            asset_id="NASDAQ:AAPL",
            portfolio_id=portfolio.id,
            event_date=datetime.date(2021, 1, 26),
        )

        portfolio_event.update_portfolio_asset_holding()
        db.session.commit()

        portfolio_event = PortfolioEvent(
            units=5,
            add_action=True,
            fees=15,
            price_per_share=116,
            exchange_rate=1.0,
            note="",
            asset_id="NASDAQ:AAPL",
            portfolio_id=portfolio.id,
            event_date=datetime.date(2021, 3, 8),
        )

        portfolio_event.update_portfolio_asset_holding()
        db.session.commit()

        if True:
            # Test case from Tyson's spreadsheet
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
                    exchange_rate=1.0,
                    note="I think this stock has growth potential",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 1),
                ),
                asset_cba,
                db,
                [0.0, 0.0, 8000.0, 80.0],
            )

            #
            create_asset_event_with_current_price(
                dict(
                    units=100,
                    add_action=True,
                    fees=15,
                    price_per_share=90,
                    exchange_rate=1.0,
                    note="Good stock",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 3),
                ),
                asset_cba,
                db,
                [0.0, 1000.0, 18000.0, 85.0],
            )

            create_asset_event_with_current_price(
                dict(
                    units=150,
                    add_action=True,
                    fees=15,
                    price_per_share=100,
                    exchange_rate=1.0,
                    note="Good stock",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 5),
                ),
                asset_cba,
                db,
                [0.0, 3000.0, 35000.0, 91.42857142857143],
            )

            # Changed 3
            create_asset_event_with_current_price(
                dict(
                    units=200,
                    add_action=True,
                    fees=15,
                    price_per_share=120,
                    exchange_rate=1.0,
                    note="I should not have sold",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 11),
                ),
                asset_cba,
                db,
                # [4800.0, 3428.5714285714275, 38400.0, 109.28571428571429],
            )

            # Changed 1
            create_asset_event_with_current_price(
                dict(
                    units=100,
                    add_action=False,
                    fees=15,
                    price_per_share=105,
                    exchange_rate=1.0,
                    note="Taking profits, I think I should sell more later",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 7),
                ),
                asset_cba,
                db,
                # [2500.0, 3392.8571428571413, 26250.0, 91.42857142857143],
            )

            # Changed 2
            create_asset_event_with_current_price(
                dict(
                    units=130,
                    add_action=False,
                    fees=15,
                    price_per_share=110,
                    exchange_rate=1.0,
                    note="Taking more profits",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 9),
                ),
                asset_cba,
                db,
                # [4800.0, 2228.5714285714275, 13200.0, 91.42857142857143],
                # Should be Change 3 value after reordering/regeneration
                # This is not the case as the current_price of the asset is in a bad (out-of-order) state.
            )

            # After changes should still be correct due to regeneration of realised value
            create_asset_event_with_current_price(
                dict(
                    units=200,
                    add_action=False,
                    fees=15,
                    price_per_share=70,
                    exchange_rate=1.0,
                    note="It's a test asset ticker!",
                    asset_id="VIRT:CBA",
                    portfolio_id=portfolio.id,
                    event_date=datetime.date(2021, 1, 13),
                ),
                asset_cba,
                db,
                [-2800.0, -4714.285714285716, 8400.0, 109.28571428571429],
            )

    AssetService.load_asset_data(db)

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="NASDAQ:TEAM").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to Github/Microsoft",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 18),
        ),
        tmp_asset,
        db,
    )
    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to Github/Microsoft",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:NAB").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to CBA",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:NAB").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to CBA",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:WBC").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to CBA",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:WBC").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to CBA",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:ANZ").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to CBA",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:ANZ").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to CBA",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:BHP").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="Competitor to Rio Tinto",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    tmp_asset = db.session.query(Asset).filter_by(ticker_symbol="ASX:CSL").first()

    create_asset_event_with_current_price(
        dict(
            units=20,
            add_action=True,
            fees=15,
            price_per_share=tmp_asset.current_price,
            exchange_rate=1.0,
            note="",
            asset_id=tmp_asset.ticker_symbol,
            portfolio_id=portfolio2.id,
            event_date=datetime.date(2021, 3, 30),
        ),
        tmp_asset,
        db,
    )

    WatchlistService.add_watchlist(user.id, "NASDAQ:AAPL")
    WatchlistService.add_watchlist(user.id, "ASX:CBA")
    WatchlistService.add_watchlist(user.id, "ASX:ART")

    # Competition portfolio test data
    competition_user_1 = Investor(
        username="janesmith",
        first_name="Jane",
        email="janesmith@example.org",
        admin_account=False,
        password="WjjTeWGdylJkH2Pq",
        email_verified=True,
        country_of_residency="AU",
    )
    db.session.add(competition_user_1)
    db.session.commit()
    competition_portfolio_1 = Portfolio(
        currency="USD",
        tax_residency="AU",
        name="Safe stocks",
        description="",
        competition_portfolio=True,
        public_portfolio=True,
        buying_power=10000,
        investor_id=competition_user_1.id,
    )
    db.session.add(competition_portfolio_1)
    db.session.commit()

    competition_user_2 = Investor(
        username="johnsmith",
        email="johnsmith@example.org",
        admin_account=False,
        password="WjjTeWGdylJkH2Pq",
        email_verified=True,
        country_of_residency="AU",
    )
    db.session.add(competition_user_2)
    db.session.commit()
    competition_portfolio_2 = Portfolio(
        currency="USD",
        tax_residency="AU",
        name="HODL!!",
        description="",
        competition_portfolio=True,
        public_portfolio=True,
        buying_power=10000,
        investor_id=competition_user_2.id,
        view_count=10,
    )
    db.session.add(competition_portfolio_2)
    db.session.commit()

    portfolio_event = PortfolioEvent(
        units=50000,
        add_action=True,
        fees=0,
        price_per_share=0.0788,
        exchange_rate=1.0,
        note="",
        asset_id="CRYPTO:DOGE",
        portfolio_id=competition_portfolio_2.id,
        event_date=datetime.date(2021, 2, 8),
    )
    portfolio_event.update_portfolio_asset_holding()
    db.session.commit()

    portfolio_event = PortfolioEvent(
        units=10,
        add_action=True,
        fees=0,
        price_per_share=378.85,
        exchange_rate=1.0,
        note="",
        asset_id="NYSE:GME",
        portfolio_id=competition_portfolio_2.id,
        event_date=datetime.date(2021, 1, 27),
    )
    portfolio_event.update_portfolio_asset_holding()
    db.session.commit()

    portfolio_event = PortfolioEvent(
        units=10000,
        add_action=False,
        fees=0,
        price_per_share=0.0388,
        exchange_rate=1.0,
        note="",
        asset_id="CRYPTO:DOGE",
        portfolio_id=competition_portfolio_2.id,
        event_date=datetime.date(2021, 2, 8),
    )
    portfolio_event.update_portfolio_asset_holding()
    db.session.commit()
