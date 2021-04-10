import { Card } from '@rocketmaven/componentsStyled/Card';
import { useAdvancedSearch } from '@rocketmaven/hooks/http';
import { useAdvancedSearchParams } from '@rocketmaven/hooks/store';
import Page from '@rocketmaven/pages/_Page';
import { Button, Col, Form, Input, Select, Table } from 'antd';
import { isEmpty } from 'ramda';
import { assetColumns } from './tableDefinition';

export type AssetSearch = {
  ticker_symbol: string
  asset_additional: string
  market_cap: number
  country: string
  name: string
  industry: string
  current_price: number
  price_last_updated: Date
  currency: string
  data_source: string
}

export type AssetSearchPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [AssetSearch]
}

const PAGE_SIZE = 10
const AdvancedSearch = () => {
  const { currentPage, queryParams, cachedData, dispatch } = useAdvancedSearchParams()
  const { data, isLoading, myFetch } = useAdvancedSearch()
  const dataDisplay = isEmpty(data) ? cachedData : data

  const onFinish = async (values: any) => {
    const queryPrefix = `?page=1&per_page=${PAGE_SIZE}`
    let queryParams = ''
    if (values.textInput) {
      queryParams += `&q=${values.textInput}`
    }
    if (values.industryInput) {
      queryParams += `&industry=${values.industryInput}`
    }
    if (values.exchangeInput) {
      queryParams += `&exchange=${values.exchangeInput.join(',')}`
    }
    const results = await myFetch(queryPrefix + queryParams)
    dispatch({
      type: 'ADV_SEARCH/UPDATE',
      payload: {
        currentPage: 1,
        queryParams,
        cachedData: results
      }
    })
  }

  const onChange = async (pagination: any) => {
    const queryPrefix = `?page=${pagination.current}&per_page=${PAGE_SIZE}&`
    const results = await myFetch(queryPrefix + queryParams)
    dispatch({
      type: 'ADV_SEARCH/UPDATE',
      payload: {
        currentPage: pagination.current,
        queryParams,
        cachedData: results
      }
    })
  }

  return (
    <Page>
      <Col style={{ height: '100vh' }}>
        <h1>Find Assets</h1>

        <Form
          name="advancedSearch"
          className="advanced-search-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="textInput"
          >
            <Input
              placeholder="Asset or ticker name (Optional)"
            />
          </Form.Item>
          <Form.Item
            name="exchangeInput"

          >
            <Select
              mode={"multiple"}
              placeholder='Exchange (Optional)'
            >
              <Select.Option value={"ASX"}>ASX</Select.Option>
              <Select.Option value={"CRYPTO"}>CRYPTO</Select.Option>
              <Select.Option value={"NASDAQ"}>NASDAQ</Select.Option>
              <Select.Option value={"NYSE"}>NYSE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="industryInput"
          >
            <Input
              placeholder="Industry Name (Optional)"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              Search
            </Button>
          </Form.Item>
        </Form>
        {
          // undefined and empty cases
          isEmpty(dataDisplay) || !dataDisplay
            ? null
            :
            <Card
              title={"Search Results"}
              style={{ width: "90%", overflowX: "auto" }}
            >
              <Table
                columns={assetColumns}
                dataSource={dataDisplay.results}
                rowKey="id"
                style={{ marginBottom: '4rem' }}
                pagination={{ total: dataDisplay.total, showSizeChanger: false, pageSize: PAGE_SIZE, current: currentPage }}
                onChange={onChange}
              />
            </Card>
        }
      </Col>
    </Page>
  )
}

export default AdvancedSearch
