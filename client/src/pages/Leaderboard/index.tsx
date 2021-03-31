import Page from '@rocketmaven/pages/_Page'
import { Form, Input, Button, Row, Col } from 'antd'
import { urls } from '@rocketmaven/data/urls'
import { Investor } from '@rocketmaven/pages/Account/types'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Table } from 'antd'
import { useState, useRef, useMemo } from 'react'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { isEmpty } from 'ramda'
import { useFetchGetLeaderboards } from '@rocketmaven/hooks/http'
import { PortfolioInfo, PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import {  message } from "antd";
import { Link } from 'react-router-dom';
import { Text } from '@rocketmaven/componentsStyled/Typography'

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

const Leaderboard = () => {

  const { data, isLoading }: any = useFetchGetLeaderboards();
  var historyTable = null
  if (data && !isEmpty(data)) {
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
      console.log(testVal);
      let username = testVal.username;
      if (testVal.first_name) {
        username = testVal.first_name
        if (testVal.last_name) {
          username += " " + testVal.last_name
        }
      }

      return {
        children: <span>{username}</span>
      }
    }
    const portfolioLinkRenderer = (testVal: string, record: any) => {
      if (testVal) {
        return (
          <Link to={urls.portfolio + "/" + testVal}>View Portfolio</Link>
        )
      }
      return (
        <Text>Private Portfolio</Text>
      );
    }
    const portfolios: [PortfolioInfo] = data.results

    const valueColumns = [
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

    let datas: any = []

    if (!portfolios || isEmpty(portfolios)) {
      message.error("Leaderboard is empty!")
      return null;
    }

    {portfolios.map((portfolio, index) => {
      datas.push(
          {
            'Investor': portfolio.investor,
            'Buying Power': portfolio.buying_power.toFixed(2),
            'Current Market': portfolio.current_value_sum.toFixed(2),
            'Purchase Cost': portfolio.purchase_value_sum.toFixed(2),
            Unrealised: (portfolio.current_value_sum - portfolio.purchase_value_sum),
            'Realised (Sold Value)': portfolio.realised_sum,
            'View Portfolio': portfolio.public_portfolio ? portfolio.id : 0,
          }
        )
      })
    }

    historyTable = <Table columns={valueColumns} dataSource={datas} rowKey="id" />
  }

  // TODO(Jude)
  return (
  <Page>
    <Title>Competition Leaderboard</Title>
    {historyTable}
  </Page>
  )
}

export default Leaderboard
