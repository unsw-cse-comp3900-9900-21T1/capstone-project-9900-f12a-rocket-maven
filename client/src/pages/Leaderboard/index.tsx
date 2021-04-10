import { CrownOutlined } from '@ant-design/icons'
import { Text, Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { useFetchAPIPublicData } from '@rocketmaven/hooks/http'
import '@rocketmaven/pages/Leaderboard/style.less'
import { PortfolioInfo, PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import Page from '@rocketmaven/pages/_Page'
import { message, Table, Tooltip } from 'antd'
import { isEmpty } from 'ramda'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

const Leaderboard = () => {
  const [data, setData] = useState<null | { results: any }>(null)
  const [historyTable, setHistoryTable] = useState<React.ReactNode | null>(null)
  const [datas, setDatas] = useState<any>(null)
  useFetchAPIPublicData('/leaderboard', setData)

  const numberChangeRenderer = (testVal: string, record: any) => {
    const text = parseFloat(testVal).toFixed(2)
    return {
      props: {
        style: { color: parseFloat(testVal) < 0 ? 'red' : 'green' }
      },
      children: <span>{text}</span>
    }
  }
  const investorRenderer = (testVal: any, record: any) => {
    console.log(testVal)
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
  const portfolioLinkRenderer = (testVal: string, record: any) => {
    if (testVal) {
      return <Link to={urls.portfolio + '/' + testVal}>View Portfolio</Link>
    }
    return <Text>Private Portfolio</Text>
  }

  const valueColumns = [
    {
      title: 'Rank',
      dataIndex: 'Rank',
      render: (value: number) => {
        let brag_icon = null
        if (value == 1) {
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
      title: (
        <Tooltip placement="topLeft" title={`Market - Purchase`} arrowPointAtCenter>
          <span style={{ textDecoration: 'underline dotted' }}>Unrealised</span>
        </Tooltip>
      ),
      dataIndex: 'Unrealised',
      render: numberChangeRenderer
    },
    {
      title: (
        <Tooltip placement="topLeft" title={`Sold Value`} arrowPointAtCenter>
          <span style={{ textDecoration: 'underline dotted' }}>Realised</span>
        </Tooltip>
      ),
      dataIndex: 'Realised (Sold Value)',
      render: numberChangeRenderer
    },
    {
      title: 'Explore',
      dataIndex: 'View Portfolio',
      render: portfolioLinkRenderer
    }
  ]

  useEffect(() => {
    if (data && !isEmpty(data)) {
      const portfolios: [PortfolioInfo] = data.results

      const tmpDatas: any = []

      if (!portfolios || isEmpty(portfolios)) {
        message.error('Leaderboard is empty!')
      } else {
        {
          portfolios.map((portfolio, index) => {
            tmpDatas.push({
              Rank: portfolio.rank,
              Investor: portfolio.investor,
              Score: portfolio.competition_score.toFixed(2),
              'Buying Power': portfolio.buying_power.toFixed(2),
              'Current Market': portfolio.current_value_sum.toFixed(2),
              'Purchase Cost': portfolio.purchase_value_sum.toFixed(2),
              Unrealised: portfolio.current_value_sum - portfolio.purchase_value_sum,
              'Realised (Sold Value)': portfolio.realised_sum,
              'View Portfolio': portfolio.public_portfolio ? portfolio.id : 0
            })
          })
        }

        setDatas(tmpDatas)

        if (!tmpDatas) {
          message.error('Leaderboard is empty!')
        }
      }
    }
  }, [data])

  return (
    <Page>
      <Title>Competition Leaderboard</Title>
      <Table
        columns={valueColumns}
        dataSource={datas}
        rowClassName={(record: any) => {
          switch (true) {
            case record.Rank == 1: {
              return 'rmv-comp-leaderboard-first'
            }
            /* Can extend this for more ranks
            case (record.Rank > 1 && record.Rank < 20): {
              return 'rmv-comp-leaderboard-gold'
            }
            */
            default: {
              return ''
            }
          }
        }}
        rowKey="id"
      />
    </Page>
  )
}

export default Leaderboard
