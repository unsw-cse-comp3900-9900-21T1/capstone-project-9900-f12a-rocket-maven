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
    title: 'Unrealised (Market - Purchase)',
    dataIndex: 'Unrealised',
    render: numberChangeRenderer
  },
  {
    title: 'Realised (Sold Value)',
    dataIndex: 'Realised (Sold Value)',
    render: numberChangeRenderer
  },
  {
    title: 'Explore',
    dataIndex: 'View Portfolio',
    render: portfolioLinkRenderer
  }
]