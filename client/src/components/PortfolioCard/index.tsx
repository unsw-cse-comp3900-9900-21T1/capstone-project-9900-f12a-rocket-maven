import { EyeOutlined, PlusOutlined, SettingOutlined, ShareAltOutlined } from '@ant-design/icons'
import { RealisedValue, UnrealisedValue } from '@rocketmaven/components/TableTooltips'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Row } from '@rocketmaven/componentsStyled/Grid'
import { storeContext } from '@rocketmaven/data/app/store'
import { currencyCodeToName } from '@rocketmaven/data/currency-code-to-name'
import { urls } from '@rocketmaven/data/urls'
// import { PortfolioWrap } from '@rocketmaven/pages/Portfolio/PortfolioList/PaginatedPortfolioDisplay/styled'
import { useAccessToken } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import {
  Button,
  Descriptions,
  Divider,
  Input,
  message,
  Modal,
  PageHeader,
  Statistic,
  Table,
  Tag,
  Tooltip
} from 'antd'
import { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

type Props = {
  portfolio: PortfolioInfo
  refreshPortfolios: () => void
  singleView?: boolean
}

const PortfolioCard = ({ portfolio, refreshPortfolios, singleView = false }: Props) => {
  const { state } = useContext(storeContext)
  const { userId } = state

  const routerObject = useHistory()
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const [isShareModalVisible, setIsShareModalVisible] = useState(false)
  const [modalShareURL, setModalShareURL] = useState('')

  const showModalForShare = () => {
    setIsShareModalVisible(true)
  }

  const handleOkForShare = () => {
    setIsShareModalVisible(false)
  }

  const handleCancelForShare = () => {
    setIsShareModalVisible(false)
  }

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

  const columns: any = [
    {
      title: 'Ticker Symbol',
      key: 'asset_id',
      dataIndex: 'asset_id',
      render: (value: string) => (
        <span>
          <Tooltip placement="left" title={`View ${value} details and graph`} arrowPointAtCenter>
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

          <Tooltip placement="left" title={`Filter holding history by ${value}`} arrowPointAtCenter>
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
      render: (value: number) => currencyPrefix + ' ' + +value.toFixed(2)
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
      render: (value: number) => currencyPrefix + ' ' + value.toFixed(2)
    },

    ...(singleView
      ? [
          {
            title: 'Purchase Value',
            dataIndex: 'purchase_value',
            render: (value: number) => currencyPrefix + ' ' + +value.toFixed(2)
          }
        ]
      : []),

    {
      title: 'Current Value',
      dataIndex: 'current_value',
      render: (value: number) => currencyPrefix + ' ' + +value.toFixed(2)
    },

    {
      title: 'Unrealised Profit/Loss',
      dataIndex: 'unrealised_units',
      render: numberChangeRenderer
    },

    ...(singleView
      ? [
          {
            title: 'Realised Total',
            dataIndex: 'realised_total',
            render: (value: number) => value.toFixed(2)
          },
          { title: 'Last Updated', dataIndex: 'last_updated' }
        ]
      : []),

    {
      title: 'Latest Note',
      dataIndex: 'latest_note'
    } /* https://ant.design/components/table/ */
  ]

  if (!portfolio.competition_portfolio && !singleView) {
    columns.push({
      title: 'Action',
      dataIndex: 'asset_id',
      key: 'x',
      render: (value: string) => (
        <a title={value} aria-valuenow={portfolio.id} onClick={useDeleteAssetPortfolioHolding}>
          Delete
        </a>
      )
    })
  }

  let currencyPrefix = ''
  if (portfolio.currency && portfolio.currency in currencyCodeToName) {
    Object.entries(currencyCodeToName).forEach((keyVal) => {
      if (keyVal[0] == portfolio.currency) {
        currencyPrefix = keyVal[1]['symbol']
      }
    })
  }
  const value = [
    ['Current Market', [false, portfolio.current_value_sum]],
    ['Purchase Cost', [false, portfolio.purchase_value_sum]],
    [
      UnrealisedValue,
      [true, (portfolio.current_value_sum - portfolio.purchase_value_sum).toFixed(2)]
    ],
    [RealisedValue, [true, portfolio.realised_sum]]
  ]

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
  return (
    <Card
      bodyStyle={{ paddingTop: '0px' }}
      style={singleView ? { width: '90%', overflowX: 'auto', padding: '0px' } : { padding: '0px' }}
      title={cardTitle}
      actions={
        !singleView
          ? [
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
              </Tooltip>,
              ...(portfolio.public_portfolio
                ? [
                    <Tooltip placement="topLeft" title="Share" arrowPointAtCenter>
                      <ShareAltOutlined
                        key="share"
                        onClick={() => {
                          setModalShareURL(
                            new URL(window.location.href).origin +
                              urls.portfolio +
                              '/' +
                              portfolio.id
                          )
                          showModalForShare()
                        }}
                      />
                    </Tooltip>
                  ]
                : [])
            ]
          : []
      }
    >
      <Modal
        title="Share Portfolio"
        visible={isShareModalVisible}
        onOk={handleOkForShare}
        onCancel={handleCancelForShare}
      >
        <Input value={modalShareURL} />
      </Modal>
      <Descriptions column={2} size="small" bordered style={{ marginBottom: '1rem' }}>
        {singleView ? (
          <Descriptions.Item label="Owner">{portfolio.investor.username}</Descriptions.Item>
        ) : null}
        {portfolio.competition_portfolio ? (
          <Descriptions.Item label="Buying Power">
            {portfolio.buying_power.toFixed(2)}
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label="Tax Residency">{portfolio.tax_residency}</Descriptions.Item>
      </Descriptions>

      <Row>
        {value.map(function (e) {
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
              prefix={currencyPrefix}
            />
          )
        })}
      </Row>

      {portfolio.recommended && portfolio.recommended.length > 0 ? (
        <Divider>Recommended</Divider>
      ) : null}
      {portfolio.recommended && portfolio.recommended.length > 0
        ? portfolio.recommended.map(function (e) {
            return (
              <Link to={urls.asset + '/' + e[0]}>
                <Tag color="red">{e[1]}</Tag>
              </Link>
            )
          })
        : null}

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
}

export default PortfolioCard
