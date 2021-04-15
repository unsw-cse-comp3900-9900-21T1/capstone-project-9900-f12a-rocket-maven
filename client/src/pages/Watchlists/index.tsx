import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import {
  useAddWatchListItem,
  useDeleteWatchListItem,
  useGetWatchlist
} from '@rocketmaven/hooks/http'
import Page from '@rocketmaven/pages/_Page'
import { Button, Form, Table } from 'antd'
import { isEmpty } from 'ramda'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createWatchListColumns } from './tableDefinitions'
import { AssetInfo, WatchListItem, WatchListPagination } from './types'

const Watchlists = () => {
  const [refreshAfterNotificationSet, setRefreshAfterNotificationSet] = useState(1)
  const watchlist: WatchListPagination = useGetWatchlist(refreshAfterNotificationSet)
  const routerObject = useHistory()
  const deleteAssetId = useDeleteWatchListItem()
  const addWatchListItem = useAddWatchListItem()
  const deleteWatchListItem = async (e: any) => {
    const asset_id = e.target.getAttribute('title')
    await deleteAssetId(asset_id)
    setRefreshAfterNotificationSet(refreshAfterNotificationSet + 1)
  }

  const onFinish = async (values: any) => {
    await addWatchListItem(values.asset_id.value)
    setRefreshAfterNotificationSet(refreshAfterNotificationSet + 1)
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
    const columns = createWatchListColumns(
      deleteWatchListItem,
      refreshAfterNotificationSet,
      setRefreshAfterNotificationSet
    )
    watchlistable = <Table columns={columns} dataSource={watchlistitems} rowKey="id" />
  }

  return !isEmpty(watchlistable) ? (
    <Page key={'watchlist-table-' + refreshAfterNotificationSet}>
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
