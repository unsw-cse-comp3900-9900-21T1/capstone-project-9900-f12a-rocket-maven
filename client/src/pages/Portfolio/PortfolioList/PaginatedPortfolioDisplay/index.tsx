import { EyeOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Row } from '@rocketmaven/componentsStyled/Grid'
import { storeContext } from '@rocketmaven/data/app/store'
// import { PortfolioWrap } from '@rocketmaven/pages/Portfolio/PortfolioList/PaginatedPortfolioDisplay/styled'
import { urls } from '@rocketmaven/data/urls'
import { useAccessToken } from '@rocketmaven/hooks/http'
import { PortfolioInfo, PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import {
  Button,
  Descriptions,
  Divider,
  message,
  PageHeader,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { isEmpty } from 'ramda'
import { Fragment, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

const AntText = Typography.Text

type Props = {
  portfolioPagination: PortfolioPagination
  refreshPortfolios: () => void
}

const PaginatedPortfolioDisplay = ({ portfolioPagination, refreshPortfolios }: Props) => {
  const { state } = useContext(storeContext)
  const { userId } = state

  const routerObject = useHistory()
  const { accessToken, revalidateAccessToken } = useAccessToken()
  /* (portfolio_id: string, asset_id: string) */
  async function useDeleteAssetPortfolioHolding(e: any) {
    // Double check that the password reset works in the browser we're going to demo it in
    // Briefly read that URLSearchParams may not have extensive support
    const asset_id = e.target.getAttribute('title')
    const portfolio_id = e.target.getAttribute('aria-valuenow')
    routerObject.push('/')

    const response = await fetch(`/api/v1/portfolios/${portfolio_id}/holdings`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ asset_id: asset_id })
    })
    const data = await response.json()
    if (!response.ok) {
      throw Error(`${data.msg}`)
    }
    routerObject.push('/')
  }

  if (!portfolioPagination || isEmpty(portfolioPagination)) {
    return null
  }

  const getColorOfValue = (value: number) => {
    return value < 0 ? 'red' : 'green'
  }

  const numberChangeRenderer = (testVal: string, record: any) => {
    const text = parseFloat(testVal).toFixed(2)
    return {
      props: {
        style: { color: getColorOfValue(parseFloat(testVal)) }
      },
      children: <span>{text}</span>
    }
  }

  // FIX(Jude): portolio becomes undefined and errors out
  // looks like the trigger is the token expiring
  // I would've thought the above if statement would've taken care of it
  const portfolios: [PortfolioInfo] = portfolioPagination.results
  return (
    <Fragment>
      {portfolios.map((portfolio, index) => {
        const columns: any = [
          {
            title: 'Ticker Symbol',
            key: 'asset_id',
            dataIndex: 'asset_id',
            render: (value: string) => (
              <span>
                <Tooltip
                  placement="left"
                  title={`View ${value} details and graph`}
                  arrowPointAtCenter
                >
                  <Link
                    to={`/asset/${value}`}
                    style={{
                      marginRight: '8px',
                      marginBottom: '12px'
                    }}
                  >
                    {value}
                  </Link>
                </Tooltip>

                <Tooltip
                  placement="left"
                  title={`Filter holding history by ${value}`}
                  arrowPointAtCenter
                >
                  <Button
                    type="primary"
                    style={{
                      marginRight: '8px',
                      marginBottom: '12px',
                      float: 'right'
                    }}
                  >
                    <Link to={`/portfolio/${portfolio.id}/holdings/${value}`}>History</Link>
                  </Button>
                </Tooltip>
              </span>
            )
          },
          {
            title: 'Available Units',
            dataIndex: 'available_units',
            render: (value: number) => value.toFixed(2)
          },
          {
            title: 'Purchase Price',
            dataIndex: 'average_price',
            render: (value: number) => value.toFixed(2)
          },
          {
            title: (
              <Tooltip
                placement="topLeft"
                title={`Current price of assets based on their market value`}
                arrowPointAtCenter
              >
                <span style={{ textDecoration: 'underline dotted' }}>Current Price</span>
              </Tooltip>
            ),
            dataIndex: 'market_price',
            render: (value: number) => value.toFixed(2)
          },
          /* { title: "Portfolio Id", dataIndex: "portfolio_id"}, */
          {
            title: 'Current Value',
            dataIndex: 'current_value',
            render: (value: number) => value.toFixed(2)
          },
          /* Single portfolio view? */
          /* { title: "Purchase Value", dataIndex: "purchase_value", render:  (value: number) => (value.toFixed(2)),}, */
          /* { title: "Last Updated", dataIndex: "last_updated"}, */
          /* Single portfolio view? */
          /* { title: "Realised Total", dataIndex: "realised_total", render:  (value: number) => (value.toFixed(2)),}, */
          {
            title: 'Unrealised Profit/Loss',
            dataIndex: 'unrealised_units',
            render: numberChangeRenderer
          },
          {
            title: 'Latest Note',
            dataIndex: 'latest_note'
          } /* https://ant.design/components/table/ */
        ]

        if (!portfolio.competition_portfolio) {
          columns.push({
            title: 'Action',
            dataIndex: 'asset_id',
            key: 'x',
            render: (value: string) => (
              <a
                title={value}
                aria-valuenow={portfolio.id}
                onClick={useDeleteAssetPortfolioHolding}
              >
                Delete
              </a>
            )
          })
        }

        const value = {
          'Current Market': [false, portfolio.current_value_sum],
          'Purchase Cost': [false, portfolio.purchase_value_sum],
          'Unrealised (Market - Purchase)': [
            true,
            (portfolio.current_value_sum - portfolio.purchase_value_sum).toFixed(2)
          ],
          'Realised (Sold Value)': [true, portfolio.realised_sum]
        }

        let isPortfolioEmpty = true

        for (const asset_holding of portfolio.portfolio_asset_holding) {
          if (asset_holding.available_units > 0) {
            isPortfolioEmpty = false
            break
          }
        }

        const onDeletePortfolio = async () => {
          const url = `/api/v1/portfolios/${portfolio.id}`

          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          })

          const data = await response.json()

          if (response.ok) {
            message.success(data.msg)
            refreshPortfolios()
          } else {
            message.error(data.msg)
          }
        }

        const cardTitle = (
          <div title={portfolio.creation_date}>
            <PageHeader
              style={{ padding: '0px' }}
              title={
                <Link
                  style={{ color: 'inherit', textDecoration: 'underline wavy' }}
                  to={urls.portfolio + '/' + portfolio.id}
                >
                  {portfolio.name}
                </Link>
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
                )
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
        return (
          <Card
            bodyStyle={{ paddingTop: '0px' }}
            title={cardTitle}
            actions={[
              <Tooltip placement="topLeft" title="Add New Event" arrowPointAtCenter>
                <Link to={urls.portfolio + `/${portfolio.id}/addremove`}>
                  <PlusOutlined key="edit" />
                </Link>
              </Tooltip>,

              <Tooltip placement="topLeft" title="Edit Portfolio Settings" arrowPointAtCenter>
                <Link to={urls.portfolio + `/${portfolio.id}/edit`}>
                  <SettingOutlined key="setting" />
                </Link>
              </Tooltip>,

              <Tooltip placement="topLeft" title="Portfolio Event History" arrowPointAtCenter>
                <Link to={urls.portfolio + `/${portfolio.id}/history`}>
                  <EyeOutlined key="ellipsis" />
                </Link>
              </Tooltip>
            ]}
          >
            <Descriptions column={2} size="small" bordered style={{ marginBottom: '1rem' }}>
              {portfolio.competition_portfolio ? (
                <Descriptions.Item label="Buying Power">
                  {portfolio.buying_power.toFixed(2)}
                </Descriptions.Item>
              ) : null}
              <Descriptions.Item label="Tax Residency">{portfolio.tax_residency}</Descriptions.Item>
            </Descriptions>

            <Row>
              {Object.entries(value).map(function (e) {
                return (
                  <Statistic
                    title={e[0]}
                    value={(e[1] as [boolean, number])[1]}
                    precision={2}
                    valueStyle={{
                      color: (e[1] as [boolean, number])[0]
                        ? getColorOfValue((e[1] as [boolean, number])[1])
                        : 'initial'
                    }}
                  />
                )
              })}
            </Row>

            <Divider>Holdings</Divider>

            <Table
              columns={columns}
              dataSource={portfolio.portfolio_asset_holding.filter(
                (portfolio_asset_holding) => portfolio_asset_holding.available_units > 0
              )}
              rowKey="id"
            />
          </Card>
        )
      })}
    </Fragment>
  )
}

export default PaginatedPortfolioDisplay
