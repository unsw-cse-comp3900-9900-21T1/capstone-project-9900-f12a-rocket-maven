import {
  EyeOutlined,
  MinusOutlined,
  PlusOutlined,
  SettingOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { urls } from '@rocketmaven/data/urls'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Button, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { numberChangeRenderer } from './helper'

type ColumnInput = {
  portfolioId: number
  currencyPrefix: string
  isCompetitionPortfolio: boolean
  singleView?: boolean
  deleteAssetPortfolioHolding: (e: any) => Promise<void>
}

export const createColumns = ({
  portfolioId,
  currencyPrefix,
  singleView,
  isCompetitionPortfolio,
  deleteAssetPortfolioHolding
}: ColumnInput) => {
  const columns = [
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
              <Link to={`/portfolio/${portfolioId}/holdings/${value}`}>History</Link>
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
      render: (value: number) => currencyPrefix + '\u200b' + +value.toFixed(2)
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
      render: (value: number) => currencyPrefix + '\u200b' + value.toFixed(2)
    },

    ...(singleView
      ? [
          {
            title: 'Purchase Value',
            dataIndex: 'purchase_value',
            render: (value: number) => currencyPrefix + '\u200b' + +value.toFixed(2)
          }
        ]
      : []),

    {
      title: 'Current Value',
      dataIndex: 'current_value',
      render: (value: number) => currencyPrefix + '\u200b' + +value.toFixed(2)
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
          }
        ]
      : []),

    {
      title: 'Latest Note',
      dataIndex: 'latest_note'
    } /* https://ant.design/components/table/ */
  ]

  if (!isCompetitionPortfolio && !singleView) {
    columns.push({
      title: 'Action',
      dataIndex: 'asset_id',
      key: 'x',
      render: (value: string) => (
        <a title={value} aria-valuenow={portfolioId} onClick={deleteAssetPortfolioHolding}>
          Delete
        </a>
      )
    })
  }
  return columns
}

type ActionListInput = {
  singleView: boolean
  portfolio: PortfolioInfo
  setModalShareURL: (arg: any) => void
  showModalForShare: () => void
}

export const createActionsList = ({
  singleView,
  portfolio,
  setModalShareURL,
  showModalForShare
}: ActionListInput) =>
  !singleView
    ? [
        <Tooltip placement="topLeft" title="Create New Holding Add/Remove Event" arrowPointAtCenter>
          <Link to={urls.portfolio + `/${portfolio.id}/addremove`}>
            <PlusOutlined key="edit" />
            /
            <MinusOutlined key="edit" />
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
                      new URL(window.location.href).origin + urls.portfolio + '/' + portfolio.id
                    )
                    showModalForShare()
                  }}
                />
              </Tooltip>
            ]
          : [])
      ]
    : []
