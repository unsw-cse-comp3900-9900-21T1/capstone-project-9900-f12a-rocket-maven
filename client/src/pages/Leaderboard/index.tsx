import { Subtitle, Title } from '@rocketmaven/componentsStyled/Typography'
import { useFetchLeaderBoard } from '@rocketmaven/hooks/http'
import { useUserId } from '@rocketmaven/hooks/store'
import '@rocketmaven/pages/Leaderboard/style.less'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import Page from '@rocketmaven/pages/_Page'
import { message, Table } from 'antd'
import { isEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { createTableColumns } from './tableDefinitions'

const Leaderboard = () => {
  const [entries, setEntries] = useState<any>(null)
  const [userEntries, setUserEntries] = useState<any>(null)
  const userId = useUserId()
  const { data } = useFetchLeaderBoard()
  const columns = createTableColumns(userId)

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
            columns={columns}
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
        columns={columns}
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
