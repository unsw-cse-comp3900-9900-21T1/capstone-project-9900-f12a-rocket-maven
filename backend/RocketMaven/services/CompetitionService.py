from RocketMaven.api.schemas import LeaderboardSchema
from RocketMaven.models import Portfolio
from RocketMaven.commons.pagination import paginate


def get_leaderboard():

    try:
        schema = LeaderboardSchema(many=True)

        # No way to sort this using hybrid_property + sqlite, order_by does not work
        query = sorted(
            Portfolio.query.filter_by(competition_portfolio=True, deleted=False).all(),
            key=lambda x: x.realised_sum + x.current_value_sum,
        )
        return {"results": schema.dump(query)}

    except Exception as e:
        print(e)
        ra
        return {"msg": "Operation failed!"}
