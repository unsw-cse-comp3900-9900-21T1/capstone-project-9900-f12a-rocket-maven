import { urls } from '@rocketmaven/data/urls'
import { useAddWatchListItem, useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { Button, Form, Popover, Select, Tooltip } from 'antd'
import { isEmpty } from 'ramda'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegStar } from 'react-icons/fa'
import { useHistory } from 'react-router'
const { Option } = Select

export type PortfolioList = {
  id: string
  name: string
  holding: number
}

export type PortfolioListFetchPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [PortfolioList]
}

type PortfolioListFetchResults = {
  data: PortfolioListFetchPagination
  isLoading: boolean
}
// https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
interface Dictionary<T> {
  [Key: string]: T
}

const AssetOptions = ({ tickerSymbol, currentPrice }: any) => {
  const routerObject = useHistory()
  const [children, setChildren] = useState([])
  const [portfolioToHolding, setPortfolioToHolding] = useState<Dictionary<string>>({})
  const { data: fetchPortfolioData }: PortfolioListFetchResults = useFetchGetWithUserId(
    `/all_portfolios/${tickerSymbol}`
  )
  const addAsset = useAddWatchListItem()
  const addToWatchlist = async () => {
    const result = await addAsset({ apiPath: tickerSymbol })
    if (result) {
      routerObject.push(urls.watchlists)
    }
  }
  const addToPortfolio = (e: any) => {
    // https://stackoverflow.com/questions/59464337/how-to-send-params-in-usehistory-of-react-router-dom
    routerObject.push({
      pathname: `${urls.portfolio}/${e.portfolio}/addremove`,
      search: `?stock_ticker=${tickerSymbol}&current_price=${currentPrice}&holdings=${
        portfolioToHolding[e.portfolio]
      }`,
      state: {
        // location state
        update: true
      }
    })
  }

  useEffect(() => {
    if (fetchPortfolioData && !isEmpty(fetchPortfolioData)) {
      let tmpPortfolioToHolding: any = {}
      const tmpChildren2: any = fetchPortfolioData.results.map((e) => {
        tmpPortfolioToHolding[e.id] = e.holding
        return (
          <Option key={e.id} value={e.id}>
            #{e.id} - {e.name}
          </Option>
        )
      })
      setPortfolioToHolding(tmpPortfolioToHolding)
      setChildren(tmpChildren2)
    }
  }, [fetchPortfolioData])

  return (
    <React.Fragment>
      <Tooltip placement="topLeft" title="Add to Watchlist" arrowPointAtCenter>
        <Button onClick={addToWatchlist} style={{ marginLeft: '0.5rem' }}>
          <FaRegStar />
        </Button>
      </Tooltip>

      <Popover
        title="Add to Portfolio"
        trigger="click"
        placement="bottom"
        content={
          <Form onFinish={addToPortfolio}>
            <Form.Item label="Portfolio" name="portfolio" rules={[{ required: true }]}>
              <Select placeholder="Please select" style={{ width: '100%' }}>
                {children}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{
                  marginLeft: '0.5rem',
                  marginRight: '0.5rem'
                }}
                htmlType="submit"
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        }
      >
        <Tooltip placement="topLeft" title="Add to Portfolio" arrowPointAtCenter>
          <Button style={{ marginLeft: '0.5rem' }}>
            <FaPlus />
          </Button>
        </Tooltip>
      </Popover>
    </React.Fragment>
  )
}

export default AssetOptions
