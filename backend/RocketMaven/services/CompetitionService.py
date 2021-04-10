from RocketMaven.api.schemas import LeaderboardSchema
from RocketMaven.models import Portfolio
from RocketMaven.commons.pagination import paginate
from sqlalchemy import func
from RocketMaven.extensions import db


def get_leaderboard():

    try:
        schema = LeaderboardSchema(many=True)

        # Sorted leaderboard of competition portfolios
        query = Portfolio.query.filter_by(
            competition_portfolio=True, deleted=False
        ).order_by(Portfolio.competition_score.desc())

        for i, m in enumerate(query.all()):
            m.rank = i + 1
        db.session.commit()

        return paginate(query, schema)

    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}
