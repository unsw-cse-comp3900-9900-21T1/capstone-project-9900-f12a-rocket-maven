
import { useUpdateWatchListItem } from '@rocketmaven/hooks/http'
import { Button, Form, Input, InputNumber } from 'antd'
import { useHistory } from 'react-router-dom'
import { validatePriceInput } from './helper'

const NotifyContent = (asset_id: string, context: string, price: number, current_price: number) => {
  const updateWatchListItem = useUpdateWatchListItem()
  const routerObject = useHistory()
  const updatePrice = async (e: any) => {
    if (validatePriceInput(e.context, e.price, e.current_price, e.asset_id)) {
      updateWatchListItem(e.asset_id, e.context, e.price)
      routerObject.go(0)
    }
  }
  return (
    <Form onFinish={updatePrice}>
      <Form.Item name="context" initialValue={context} noStyle>
        <Input value={context} type="hidden" />
      </Form.Item>
      <Form.Item name="asset_id" initialValue={asset_id} noStyle>
        <Input value={asset_id} type="hidden" />
      </Form.Item>
      <Form.Item name="current_price" initialValue={current_price} noStyle>
        <Input value={current_price} type="hidden" />
      </Form.Item>
      <Form.Item name="price">
        <InputNumber value="{price}" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Set Notification
        </Button>
      </Form.Item>
    </Form>
  )
}

export default NotifyContent