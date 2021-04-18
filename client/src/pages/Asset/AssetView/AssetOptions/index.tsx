import { urls } from '@rocketmaven/data/urls'
import { useAddWatchListItem, useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { Button, Form, Popover, Select, Tooltip } from 'antd'
import { isEmpty } from 'ramda'
import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegStar } from 'react-icons/fa'
import { useHistory } from 'react-router'
const { Option } = Select

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

const AssetOptions = ({ tickerSymbol, currentPrice }: any) => {
  const routerObject = useHistory()
  const [children, setChildren] = useState([])
  const { data: fetchPortfolioData }: PortfolioListFetchResults = useFetchGetWithUserId(
    '/all_portfolios?deleted=false'
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
      search: `?stock_ticker=${tickerSymbol}&current_price=${currentPrice}&holdings=?`,
      state: {
        // location state
        update: true
      }
    })
  }

  useEffect(() => {
    if (fetchPortfolioData && !isEmpty(fetchPortfolioData)) {
      const tmpChildren: any = []
      const tmpChildren2: any = fetchPortfolioData.results.map((e) => {
        tmpChildren.push(e.id)
        return (
          <Option key={e.id} value={e.id}>
            #{e.id} - {e.name}
          </Option>
        )
      })
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
