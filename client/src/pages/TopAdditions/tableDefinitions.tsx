import { RealisedValue, UnrealisedValue } from '@rocketmaven/components/TableTooltips'
import { Text } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { Link } from 'react-router-dom'

const investorRenderer = (testVal: any, record: any) => {
  let username = testVal.username
  if (testVal.first_name) {
    username = testVal.first_name
    if (testVal.last_name) {
      username += ' ' + testVal.last_name
    }
  }
  return {
    children: <span>{username}</span>
  }
}

const numberChangeRenderer = (testVal: string, record: any) => {
  const text = parseFloat(testVal).toFixed(2)
  return {
    props: {
      style: { color: parseFloat(testVal) < 0 ? 'red' : 'green' }
    },
    children: <span>{text}</span>
  }
}

const portfolioLinkRenderer = (testVal: string, record: any) => {
  if (testVal) {
    return <Link to={urls.portfolio + '/' + testVal}>View Portfolio</Link>
  }
  return <Text>Private Portfolio</Text>
}

export const portfolioColumns = [
  {
    title: 'Investor',
    dataIndex: 'Investor',
    render: investorRenderer
  },
  { title: 'Buying Power', dataIndex: 'Buying Power' },
  { title: 'Purchase Cost', dataIndex: 'Purchase Cost' },
  { title: 'Current Market', dataIndex: 'Current Market' },
  {
    title: UnrealisedValue,
    dataIndex: 'Unrealised',
    render: numberChangeRenderer
  },
  {
    title: RealisedValue,
    dataIndex: 'Realised',
    render: numberChangeRenderer
  },
  {
    title: 'Explore',
    dataIndex: 'View Portfolio',
    render: portfolioLinkRenderer
  }
]

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
  }
]
