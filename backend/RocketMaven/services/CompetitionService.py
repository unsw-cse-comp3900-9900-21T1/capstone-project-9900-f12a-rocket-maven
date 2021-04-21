from flask_jwt_extended import get_jwt_identity
from RocketMaven.api.schemas import LeaderboardSchema
from RocketMaven.commons.pagination import paginate
from RocketMaven.extensions import db
from RocketMaven.models import Asset, Portfolio, PortfolioAssetHolding
from RocketMaven.services.AssetService import update_assets_price
from sqlalchemy import and_


def get_leaderboard():
    """ Returns the Rocket Maven leaderboard (top competition portfolios) """
    try:
        schema = LeaderboardSchema(many=True)

        assets = (
            db.session()
            .query(Asset)
            .join(PortfolioAssetHolding)
            .join(Portfolio)
            .filter_by(competition_portfolio=True, deleted=False)
        )
        update_assets_price(assets)

        # Sorted leaderboard of competition portfolios
        query = (
            Portfolio.query.join(PortfolioAssetHolding, isouter=True)
            .join(Asset, isouter=True)
            .filter(
                and_(
                    Portfolio.competition_portfolio == True,  # noqa: E712
                    Portfolio.deleted == False,  # noqa: E712
                )
            )
            .group_by(PortfolioAssetHolding.portfolio_id)
            .order_by(Portfolio.competition_score.desc())
        )

        for i, m in enumerate(query.all()):
            m.rank = i + 1

        db.session.commit()

        user_leaderboard = []
        if get_jwt_identity():
            user_leaderboard = query.filter(
                Portfolio.investor_id == get_jwt_identity()
            ).all()

        return [schema.dump(user_leaderboard), paginate(query, schema)]

    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}, 400
