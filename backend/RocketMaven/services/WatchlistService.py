from RocketMaven.api.schemas import WatchlistSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import Asset, Investor, Watchlist
from RocketMaven.services.AssetService import update_assets_price
from flask import request


def add_watchlist(investor_id: int, ticker_symbol: str):
    """Adds the ticker symbol to the investor's watchlist
    Returns:
       200 - Asset already in the watchlist
       201 - Asset added to the watchlist
       400 - Error adding item to watchlist
       404 - investor/asset id not found in system
    """
    try:
        investor = Investor.query.get(investor_id)
        if not investor:
            return {"msg": "investor id not found in system"}, 404
        asset = Asset.query.get(ticker_symbol)
        if not asset:
            return {"msg": "asset id not found in system"}, 404
        watchlist = Watchlist.query.get(
            {"asset_id": ticker_symbol, "investor_id": investor_id}
        )
        if watchlist:
            return {"msg": "asset already in watchlist"}, 200
        new_watchlist = Watchlist(asset_id=ticker_symbol, investor_id=investor_id)
        db.session.add(new_watchlist)
        db.session.commit()
        return {"msg": "asset added to watchlist"}, 201
    except Exception as err:
        print(err)
        return {"msg": "error adding item to watchlist"}, 400


def get_watchlist(investor_id: int):
    """Get a paginated list containing the investor's watchlist
    Returns:
        200 - paginated list of assets
        400 - error getting the watchlist
        404 - investor id not found in the system
    """
    try:
        schema = WatchlistSchema(many=True)
        investor = Investor.query.get(investor_id)
        if not investor:
            return {"msg": "investor id not found in system"}, 404
        watchlist = Watchlist.query.filter_by(investor_id=investor_id)

        assets = (
            db.session().query(Asset).join(Watchlist).filter_by(investor_id=investor_id)
        )
        update_assets_price(assets)

        return paginate(watchlist, schema)
    except Exception as err:
        print(err)
        return {"msg": "error getting watchlist"}, 400


def del_watchlist(investor_id: int, ticker_symbol: str):
    """Remove the asset from the investor's watchlist
    Returns:
        200 - asset removed from the watchlist
        400 - asset not in the watchlist or other error deleting the asset from the watchlist
        404 - investor id not found in the system
    """
    try:
        investor = Investor.query.get(investor_id)
        if not investor:
            return {"msg": "investor id not found in system"}, 404
        asset = Asset.query.get_or_404(ticker_symbol)
        if not asset:
            return {"msg": "asset id not found in system"}, 404
        watchlist = Watchlist.query.get(
            {"asset_id": ticker_symbol, "investor_id": investor_id}
        )
        if not watchlist:
            return {"msg": "asset not in watchlist"}, 400
        db.session.delete(watchlist)
        db.session.commit()
        return {"msg": "asset removed from watchlist"}, 200
    except Exception as err:
        print(err)
        return {"msg": "error deleting asset from watchlist"}, 400


def set_nofication(flag: str, investor_id: int, ticker_symbol: str):
    """Set the price notification values for the given asset in the user's watchlist
    Returns:
        200 - notification price updated
        400 - error adding the price notification
        404 - asset not found or not in watchlist
    """
    price = request.json.get("price")
    if not price:
        return {"msg": "price not found"}, 404
    try:
        watching = Watchlist.query.filter_by(
            investor_id=investor_id, asset_id=ticker_symbol
        ).first()
        if not watching:
            return {"msg": "watching not found in system"}, 404
        if flag == "low":
            watching.price_low = price
            db.session.commit()
            return {"msg": "low price notification set"}, 200
        else:
            watching.price_high = price
            db.session.commit()
            return {"msg": "high price notification set"}, 200

    except Exception as err:
        print(err)
        return {"msg": "error adding price notification"}, 400


def send_watchlist_email():
    """Set the price notification values for the given asset in the user's watchlist
    Returns:
        200 - email success
        400 - email failed
    """

    pass
    print("Running!")
