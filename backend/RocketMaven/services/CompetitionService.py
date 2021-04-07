from RocketMaven.api.schemas import LeaderboardSchema
from RocketMaven.models import Portfolio
from RocketMaven.commons.pagination import paginate


def get_leaderboard():

    try:
        schema = LeaderboardSchema(many=True)
        query = Portfolio.query.filter_by(competition_portfolio=True, deleted=False)
        return paginate(query, schema)

    except Exception as e:
        print(e)
        return {"msg": "Operation failed!"}
