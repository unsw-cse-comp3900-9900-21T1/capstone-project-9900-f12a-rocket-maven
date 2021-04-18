import { urls } from '@rocketmaven/data/urls'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Divider, Tag } from 'antd'
import { Link } from 'react-router-dom'

type Props = {
  portfolio: PortfolioInfo
}

const RecommendedAssets = ({ portfolio }: Props) => (
  (portfolio.recommended && portfolio.recommended.length > 0)
    ?
    <>
      <Divider>Recommended</Divider>
      {
        portfolio.recommended.map((e: any) =>
          <Link to={urls.asset + '/' + e[0]}>
            <Tag color="red">{e[1]}</Tag>
          </Link>
        )
      }
    </>
    : null
)

export default RecommendedAssets