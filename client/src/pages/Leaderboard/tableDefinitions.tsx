import { CrownOutlined } from '@ant-design/icons'
import { RealisedValue, UnrealisedValue } from '@rocketmaven/components/TableTooltips'
import { urls } from '@rocketmaven/data/urls'
import React from 'react'
import { Link } from 'react-router-dom'

const numberChangeRenderer = (testVal: string) => {
  const text = parseFloat(testVal).toFixed(2)
  return {
    props: {
      style: { color: parseFloat(testVal) < 0 ? 'red' : 'green' }
    },
    children: <span>{text}</span>
  }
}
const investorRenderer = (testVal: any) => {
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

export const portfolioLinkRendererPrototype = (userId?: number) => (testVal: number, record: any) => {
  if ((testVal || (record.Investor && record.Investor.id === userId)) && testVal !== 0) {
    return <Link to={urls.portfolio + '/' + testVal}>View Portfolio</Link>
  }
  return <>Private Portfolio</>
}

export const createTableColumns = (userId?: number) => {
  const portfolioLinkRenderer = portfolioLinkRendererPrototype(userId)
  return [
    {
      title: 'Rank',
      dataIndex: 'Rank',
      render: (value: number) => {
        let brag_icon = null
        if (value === 1) {
          brag_icon = <CrownOutlined />
        }
        return (
          <span>
            {brag_icon} {value}
          </span>
        )
      }
    },
    {
      title: 'Investor',
      dataIndex: 'Investor',
      render: investorRenderer
    },
    { title: 'Score', dataIndex: 'Score' },
    { title: 'Purchase Cost', dataIndex: 'Purchase Cost' },
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
}
