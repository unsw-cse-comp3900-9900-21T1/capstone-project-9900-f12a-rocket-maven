from RocketMaven.extensions import db
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.models import Investor, Asset, investor_watches
from RocketMaven.commons.pagination import paginate


def add_watchlist(investor_id: int, ticker_symbol: str):
    """ Adds the ticker symbol to the investor's watchlist 
        Returns:
            200 - Asset already in the watchlist
            201 - Asset added to the watchlist
            400 - Error adding item to watchlist
            404 - investor/asset id not found in system
    """
    try:
        investor = Investor.query.get(investor_id)
        if not investor:
            return { "msg": "investor id not found in system"}, 404
        asset = Asset.query.get(ticker_symbol)
        if not asset:
            return { "msg": "asset id not found in system"}, 404
        if asset in investor.watchlist_items:
            return { "msg": "asset already in watchlist" }, 200
        investor.watchlist_items.append(asset)
        db.session.commit()
        return { "msg": "asset added to watchlist" }, 201
    except Exception as err:
        print(err)
        return { "msg": "error adding item to watchlist" }, 400
    

def get_watchlist(investor_id: int):
    """ Get a paginated list containing the investor's watchlist
        Returns:
            200 - paginated list of assets
            400 - error getting the watchlist
            404 - investor id not found in the system
    """
    try:
        schema = AssetSchema(many=True)
        investor = Investor.query.get(investor_id)
        if not investor:
            return { "msg": "investor id not found in system"}, 404
        return paginate(investor.watchlist_items, schema)
    except Exception as err:
        print(err)
        return { "msg": "error getting watchlist" }, 400


def del_watchlist(investor_id: int, ticker_symbol: str):
    """ Remove the asset from the investor's watchlist 
        Returns:
            200 - asset removed from the watchlist
            400 - asset not in the watchlist or other error deleting the asset from the watchlist
            404 - investor id not found in the system
    """
    try:
        investor = Investor.query.get(investor_id)
        if not investor:
            return { "msg": "investor id not found in system"}, 404
        asset = Asset.query.get_or_404(ticker_symbol)
        if not asset:
            return { "msg": "asset id not found in system"}, 404
        if asset not in investor.watchlist_items:
            return { "msg": "asset not in watchlist"}, 400
        investor.watchlist_items.remove(asset)
        db.session.commit()
        return { "msg": "asset removed from watchlist" }, 200
    except Exception as err:
        print(err)
        return { "msg": "error deleting asset from watchlist" }, 400



    