import { Link } from 'react-router-dom'

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
    )
  },
  {
    title: 'Name',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      console.log(JSON.parse(value))
      const asset_additional = JSON.parse(value)
      const focus = asset_additional.longName
      if (focus) {
        return <div>{focus}</div>
      }
      return null
    }
  },
  {
    title: 'Price',
    dataIndex: 'current_price'
  },
  {
    title: 'Change',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      const focus = asset_additional.regularMarketChange
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    }
  },
  {
    title: 'Market Cap',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      const focus = asset_additional.marketCap
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    }
  },
  {
    title: '52-Week High',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      const focus = asset_additional.fiftyTwoWeekHigh
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    }
  },
  {
    title: '52-Week Low',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      const focus = asset_additional.fiftyTwoWeekLow
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    }
  },
]
