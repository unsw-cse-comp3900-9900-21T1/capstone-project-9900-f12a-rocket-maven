import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { urls } from '@rocketmaven/data/urls'
import { useState, useRef, useMemo } from 'react'
import { useHistory } from 'react-router'
import { PortfolioInfo, PortfolioEventCreate } from '@rocketmaven/pages/Portfolio/types'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '@rocketmaven/hooks/http'

import { Row, Statistic } from 'antd'
import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'

type Props = {
  portfolioId?: string
  portfolioInfo: PortfolioInfo
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const PortfolioAssetEditForm = ({ portfolioId, portfolioInfo }: Props) => {
  const [addActionValue, setAddActionValue] = useState(true)
  const [valued, setValued] = useState()
  const [price, setPrice] = useState()
  const [form] = Form.useForm()

  let initialValues: PortfolioEventCreate = {
    add_action: addActionValue,
    asset_id: '',
    fees: 0,
    note: '',
    price_per_share: 0,
    units: 0
  }
  let urlEnd = `../../../portfolios/${portfolioId}/history`

  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, 'POST', urls.portfolio)

  const onFinish = (values: any) => {
    values.asset_id = values.asset_id.value
    values.add_action = addActionValue
    console.log('************** values are ', values)
    setValuesAndFetch({
      ...values
    })
  }

  return (
    <Card>
      {portfolioInfo.competition_portfolio ? (
        <Row>
          <Statistic title="Buying Power" value={portfolioInfo.buying_power} precision={2} />
        </Row>
      ) : null}

      <Form
        name="normal_assetadd"
        className="assetadd-form"
        form={form}
        initialValues={{
          remember: true
        }}
        {...formItemLayout}
        onFinish={onFinish}
      >
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
          <AssetSearchBox
            showSearch
            value={valued}
            onChange={(newValue: any) => {
              setValued(newValue.key)
              form.setFieldsValue({
                price_per_share: newValue.label.props.title
              })
            }}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {!portfolioInfo.competition_portfolio ? (
          <Form.Item
            name="fees"
            label="Fees"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Input />
          </Form.Item>
        ) : null}

        <Form.Item
          name="units"
          label="Units"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        {!portfolioInfo.competition_portfolio ? (
          <Form.Item
            name="price_per_share"
            label="Price Per Unit"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Input />
          </Form.Item>
        ) : null}

        <Form.Item
          name="note"
          label="Note"
          rules={[
            {
              required: false
            }
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Button type="primary" onClick={() => setAddActionValue(true)} htmlType="submit" value={addActionValue} style={{ */}
        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={() => setAddActionValue(true)}
            htmlType="submit"
            style={{
              marginRight: '8px',
              marginBottom: '12px'
            }}
          >
            Add
          </Button>
          <Button
            type="primary"
            onClick={() => setAddActionValue(false)}
            htmlType="submit"
            danger
            style={{
              marginRight: '8px',
              marginBottom: '12px'
            }}
          >
            Remove
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PortfolioAssetEditForm
