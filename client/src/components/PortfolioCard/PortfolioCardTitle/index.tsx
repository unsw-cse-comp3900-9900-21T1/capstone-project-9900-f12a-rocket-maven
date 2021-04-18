import { urls } from '@rocketmaven/data/urls'
import { useDeletePortfolio } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Button, PageHeader, Tag } from 'antd'
import { Link } from 'react-router-dom'

type Props = {
  portfolio: PortfolioInfo
  refreshPortfolios: () => void
  singleView?: boolean
}

const CardTitle = ({ portfolio, singleView, refreshPortfolios }: Props) => {
  const deletePortfolio = useDeletePortfolio()
  const onDeletePortfolio = async () => {
    await deletePortfolio({
      apiPath: String(portfolio.id),
      redirectPath: '/'
    })
    refreshPortfolios()
  }

  let isPortfolioEmpty = true

  for (const asset_holding of portfolio.portfolio_asset_holding) {
    if (asset_holding.available_units > 0) {
      isPortfolioEmpty = false
      break
    }
  }

  return (
    <div title={portfolio.creation_date}>
      <PageHeader
        style={{ padding: '0px' }}
        title={
          !singleView ? (
            <Link
              style={{ color: 'inherit', textDecoration: 'underline wavy' }}
              to={urls.portfolio + '/' + portfolio.id}
            >
              {portfolio.name}
            </Link>
          ) : (
            portfolio.name
          )
        }
        subTitle={portfolio.description}
        tags={[
          portfolio.competition_portfolio ? (
            <Tag color="red">Competition</Tag>
          ) : (
            <Tag color="blue">Regular</Tag>
          ),
          portfolio.public_portfolio ? (
            <Tag color="red">Public</Tag>
          ) : (
            <Tag color="blue">Private</Tag>
          ),
          <Tag color="blue">{portfolio.currency}</Tag>
        ]}
        extra={[
          isPortfolioEmpty ? (
            <Button onClick={onDeletePortfolio} style={{ float: 'right' }}>
              Delete
            </Button>
          ) : null
        ]}
      />
    </div>
  )
}

export default CardTitle