import { CrownOutlined } from '@ant-design/icons'
import { RealisedValue, UnrealisedValue } from '@rocketmaven/components/TableTooltips'
import { Subtitle, Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { useFetchAPIPublicOrLoggedInData } from '@rocketmaven/hooks/http'
import { useUserId } from '@rocketmaven/hooks/store'
import '@rocketmaven/pages/Leaderboard/style.less'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import Page from '@rocketmaven/pages/_Page'
import { message, Table } from 'antd'
import { isEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Leaderboard = () => {
  const [data, setData] = useState<null | [any, { results: any }]>(null)
  const [entries, setEntries] = useState<any>(null)
  const [userEntries, setUserEntries] = useState<any>(null)

  useFetchAPIPublicOrLoggedInData('/leaderboard', setData)

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

  const userId = useUserId()

  const portfolioLinkRenderer = (testVal: number, record: any) => {
    if ((testVal || (record.Investor && record.Investor.id === userId)) && testVal != 0) {
      return <Link to={urls.portfolio + '/' + testVal}>View Portfolio</Link>
    }
    return <>Private Portfolio</>
  }

  const valueColumns = [
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

  const tableData = (portfolio: PortfolioInfo) => {
    return {
      Rank: portfolio.rank,
      Investor: portfolio.investor,
      Score: portfolio.competition_score.toFixed(2),
      'Buying Power': portfolio.buying_power.toFixed(2),
      'Current Market': portfolio.current_value_sum.toFixed(2),
      'Purchase Cost': portfolio.purchase_value_sum.toFixed(2),
      Unrealised: portfolio.current_value_sum - portfolio.purchase_value_sum,
      Realised: portfolio.realised_sum,
      'View Portfolio': portfolio.public_portfolio ? portfolio.id : 0
    }
  }

  useEffect(() => {
    if (data && !isEmpty(data)) {
      const userPortfolios: PortfolioInfo[] = data[0]
      const portfolios: [PortfolioInfo] = data[1].results

      const tmpEntries: any = []
      const tmpUserEntries: any = []

      if (!portfolios || isEmpty(portfolios)) {
        message.error('Leaderboard is empty!')
      } else {
        userPortfolios.forEach((portfolio) => {
          tmpUserEntries.push(tableData(portfolio))
        })
        portfolios.forEach((portfolio) => {
          tmpEntries.push(tableData(portfolio))
        })
        setEntries(tmpEntries)
        setUserEntries(tmpUserEntries)

        if (!tmpEntries) {
          message.error('Leaderboard is empty!')
        }
      }
    }
  }, [data])

  return (
    <Page>
      <Title>Competition Leaderboard</Title>
      Compete with other Rocket Maven users to get to the top of the leaderboard! Only 2 competition
      portfolios allowed per account.
      <br />
      Score is determined by the buying power + unrealised profit + realised profits.
      <br />
      {userEntries && !isEmpty(userEntries) ? (
        <>
          <Subtitle>Your Rankings</Subtitle>
          <Table
            pagination={false}
            columns={valueColumns}
            dataSource={userEntries}
            rowClassName={(record: any) => {
              switch (true) {
                case record.Rank === 1: {
                  return 'rmv-comp-leaderboard-first'
                }
                default: {
                  return ''
                }
              }
            }}
            rowKey="id"
          />
        </>
      ) : null}
      <br />
      <Subtitle>Top Portfolios</Subtitle>
      <Table
        columns={valueColumns}
        dataSource={entries}
        rowClassName={(record: any) => {
          switch (true) {
            case record.Rank === 1: {
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
