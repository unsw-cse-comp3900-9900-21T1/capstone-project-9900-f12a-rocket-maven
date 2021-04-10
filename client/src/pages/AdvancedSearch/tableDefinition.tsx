
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
    ),
    width: "10%"
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
    width: "20%"
  },
  {
    title: 'Price',
    dataIndex: 'current_price',
    width: "5%"
  },
  // TODO(Jude)?
  // {
  //   title: 'Currency',
  //   dataIndex: 'currency',
  //   width: "5%"
  // },
  {
    title: 'Change',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.regularMarketChange
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    },
    width: "5%"
  },
  {
    title: 'Market Cap',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.marketCap
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    },
    width: "10%"
  },
  {
    title: '52-Week High',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.fiftyTwoWeekHigh
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    },
    width: "10%"
  },
  {
    title: '52-Week Low',
    dataIndex: 'asset_additional',
    render: (value: string) => {
      const asset_additional = JSON.parse(value)
      if (!asset_additional) return null
      const focus = asset_additional.fiftyTwoWeekLow
      if (focus) {
        return <div>{focus.fmt}</div>
      }
      return null
    },
    width: "10%"
  },
  {
    title: 'Country',
    dataIndex: 'country',
    width: "10%"
  },
  {
    title: 'Industry',
    dataIndex: 'industry',
  },
]
