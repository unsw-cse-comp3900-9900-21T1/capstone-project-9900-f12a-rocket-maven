import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { useAddWatchListItem, useDeleteWatchListItem, useGetWatchlist } from '@rocketmaven/hooks/http'
import Page from '@rocketmaven/pages/_Page'
import { Button, Form, Table } from 'antd'
import { isEmpty } from 'ramda'
import { useHistory } from 'react-router-dom'
import { createWatchListColumns } from './tableDefinitions'
import { AssetInfo, WatchListItem, WatchListPagination } from './types'

const Watchlists = () => {
  const watchlist: WatchListPagination = useGetWatchlist()
  const routerObject = useHistory()
  const deleteAssetId = useDeleteWatchListItem()
  const addWatchListItem = useAddWatchListItem()
  const deleteWatchListItem = async (e: any) => {
    const asset_id = e.target.getAttribute('title')
    deleteAssetId(asset_id)
    routerObject.go(0)
  }

  const onFinish = async (values: any) => {
    addWatchListItem(values.asset_id.value)
    routerObject.go(0)
  }

  let watchlistable = null
  if (watchlist && !isEmpty(watchlist)) {
    const watchlistresults: [WatchListItem] = watchlist.results
    let watchlistitems: AssetInfo[] = []

    watchlistresults.forEach(function (e) {
      e.asset.price_high = e.price_high
      e.asset.price_low = e.price_low
      e.asset.price_high_low = [e.price_high, e.price_low]
      watchlistitems.push(e.asset)
    })
    const columns = createWatchListColumns(deleteWatchListItem)
    watchlistable = <Table columns={columns} dataSource={watchlistitems} rowKey="id" />
  }

  return !isEmpty(watchlistable) ? (
    <Page>
      <Title>Watchlist</Title>

      <Card title="Add to Watchlist">
        <Form onFinish={onFinish}>
          <Form.Item
            name="asset_id"
            label="Ticker (EXCHANGE:SYMBOL)"
            rules={[
              {
                required: true,
                message: 'Please input a ticker!'
              }
            ]}
          >
            <AssetSearchBox showSearch style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginRight: '8px',
                marginBottom: '12px'
              }}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {watchlistable}
    </Page>
  ) : null
}

export default Watchlists
