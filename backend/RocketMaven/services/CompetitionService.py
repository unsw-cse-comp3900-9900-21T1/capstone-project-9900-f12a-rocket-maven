from RocketMaven.api.schemas import LeaderboardSchema
from RocketMaven.models import Portfolio
from RocketMaven.commons.pagination import paginate
from sqlalchemy import func
from RocketMaven.extensions import db
from flask_jwt_extended import get_jwt_identity



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

        user_leaderboard = []
        if get_jwt_identity():
            user_leaderboard = query.filter_by(investor_id=get_jwt_identity()).all()

        return [schema.dump(user_leaderboard), paginate(query, schema)]


    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}
