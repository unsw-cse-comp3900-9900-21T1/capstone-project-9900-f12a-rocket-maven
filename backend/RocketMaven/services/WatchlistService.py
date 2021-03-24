from RocketMaven.extensions import db
from RocketMaven.api.schemas import AssetSchema
from RocketMaven.models import Investor, Asset, investor_watches
from RocketMaven.commons.pagination import paginate


def add_watchlist(investor_id: int, ticker_symbol: str):
    """ Adds the ticker symbol to the investor's watchlist """
    try:
        investor = Investor.query.get_or_404(investor_id)
        asset = Asset.query.get_or_404(ticker_symbol)
        if asset in investor.watchlist_items:
            return { "msg": "asset already in watchlist" }, 200
        investor.watchlist_items.append(asset)
        db.session.commit()
        return { "msg": "asset added to watchlist" }, 201
    except:
        return { "msg": "error adding item to watchlist" }, 400
    

def get_watchlist(investor_id: int):
    # data = db.session.query(Investor, Asset).\
    #             filter(
    #                 investor_watches.asset_id == Asset.ticker_symbol, 
    #                 investor_watches.investor_id == Investor.id).\
    #             filter_by(id=investor_id).all()
    # #data = Investor.query.join(Investor.asset).filter_by(id=investor_id).all()
    try:
        schema = AssetSchema(many=True)
        investor = Investor.query.get_or_404(investor_id)
        return paginate(investor.watchlist_items, schema)
    except Exception as err:
        print(err)
        return { "msg": "error getting watchlist" }, 400


def del_watchlist(investor_id: int, ticker_symbol: str):
    """ Remove the asset from the investor's watchlist """
    try:
        investor = Investor.query.get_or_404(investor_id)
        asset = Asset.query.get_or_404(ticker_symbol)
        if asset not in investor.watchlist_items:
            return { "msg": "asset not in watchlist"}, 400
        investor.watchlist_items.remove(asset)
        db.session.commit()
        return { "msg": "asset removed from watchlist" }, 200
    except Exception as err:
        print(err)
        return { "msg": "error deleting asset from watchlist" }, 400



    