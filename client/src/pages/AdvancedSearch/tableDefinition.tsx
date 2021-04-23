import { currencyCodeToName } from '@rocketmaven/data/currency-code-to-name'
import { Link } from 'react-router-dom'

function getCurrency(record: any) {
  let currencyPrefix = ''
  if (record.currency && record.currency in currencyCodeToName) {
    Object.entries(currencyCodeToName).forEach((keyVal) => {
      if (keyVal[0] == record.currency) {
        currencyPrefix = keyVal[1]['symbol']
      }
    })
  }
  return currencyPrefix
}

export const assetColumns = [
  {
    title: 'Ticker',
    dataIndex: 'ticker_symbol',
    render: (value: string) => (
      <Link
        to={`/asset/${value}`}
        style={{
          marginRight: '8px',
          marginBottom: '12px'
        }}
      >
        {value}
      </Link>
    ),
    width: '10%'
  },
  {
    title: 'Name',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.longName
      if (focus) {
        return <div>{focus}</div>
      }
      return null
    },
    width: '16%'
  },
  {
    title: 'Price',
    dataIndex: 'current_price',
    width: '7%',
    render: (value: string, record: any) => {
      return (
        <div>
          {getCurrency(record)} {value}
        </div>
      )
    }
  },
  {
    title: 'Change',
    dataIndex: 'asset_additional',
    render: (value: string, record: any) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.regularMarketChange
      if (focus) {
        return (
          <div>
            {getCurrency(record)} {focus.fmt}
          </div>
        )
      }
      return null
    },
    width: '7%'
  },
  {
    title: 'Market Cap',
    dataIndex: 'asset_additional',
    render: (value: string, record: any) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.marketCap
      if (focus) {
        return (
          <div>
            {getCurrency(record)} {focus.fmt}
          </div>
        )
      }
      return null
    },
    width: '10%'
  },
  {
    title: '52-Week High',
    dataIndex: 'asset_additional',
    render: (value: string, record: any) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.fiftyTwoWeekHigh
      if (focus) {
        return (
          <div>
            {getCurrency(record)} {focus.fmt}
          </div>
        )
      }
      return null
    },
    width: '10%'
  },
  {
    title: '52-Week Low',
    dataIndex: 'asset_additional',
    render: (value: string, record: any) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.fiftyTwoWeekLow
      if (focus) {
        return (
          <div>
            {getCurrency(record)} {focus.fmt}
          </div>
        )
      }
      return null
    },
    width: '10%'
  },
  {
    title: 'Country',
    dataIndex: 'country',
    width: '10%'
  },
  {
    title: 'Industry',
    dataIndex: 'industry'
  }
]
