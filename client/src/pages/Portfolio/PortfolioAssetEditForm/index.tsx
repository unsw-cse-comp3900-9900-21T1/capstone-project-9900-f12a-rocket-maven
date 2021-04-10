import UserAssetSearchBox from '@rocketmaven/components/UserAssetSearchBox'
import { Card } from '@rocketmaven/componentsStyled/Card'
// import { Row } from '@rocketmaven/componentsStyled/Grid'
import { urls } from '@rocketmaven/data/urls'
import { useFetchMutationWithUserId } from '@rocketmaven/hooks/http'
import { PortfolioEventCreate, PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Button, Col, Form, Input, InputNumber, Row, Statistic } from 'antd'
import { useState } from 'react'

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
  const [holdings, setHoldings] = useState(0)
  const [pricePerShare, setPricePerShare] = useState(0)
  const [currentTicker, setCurrentTicker] = useState(0)
  const [units, setUnits] = useState(0)
  const [form] = Form.useForm()

  const initialValues: PortfolioEventCreate = {
    add_action: addActionValue,
    asset_id: '',
    fees: 0,
    note: '',
    price_per_share: 0,
    units: 0,
    exchange_rate: 1
  }
  const urlEnd = `../../../portfolios/${portfolioId}/history`

  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, 'POST', urls.portfolio)

  const onFinish = (values: any) => {
    values.asset_id = values.asset_id.value
    values.add_action = addActionValue
    setValuesAndFetch({
      ...values
    })
  }

  const getColorOfValue = (value: number) => {
    return value < 0 ? 'red' : 'green'
  }

  const getLivePrice = () => {
    const myFetch = async () => {
      try {
        const response = await fetch(`/api/v1/assets/${currentTicker}/price`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw Error(`${response.status}`)
        }
        const data = await response.json()
        setPricePerShare(data.price)
        form.setFieldsValue({
          price_per_share: data.price
        })
      } catch (error) {}
    }
    myFetch()
  }

  return (
    <Card>
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
          <UserAssetSearchBox
            showSearch
            portfolioid={portfolioId}
            onChange={(newValue: any) => {
              console.log(newValue)
              setHoldings(parseFloat(newValue.label.props['data-holdings']))
              setPricePerShare(newValue.label.props.title)
              setCurrentTicker(newValue.value)
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
            <InputNumber />
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
          <InputNumber onChange={(e: any) => setUnits(e)} />
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
            <InputNumber />
          </Form.Item>
        ) : (
          <span>
            <Form.Item name="price_per_share" label="Current Value">
              <Input disabled />
            </Form.Item>
          </span>
        )}
        <Form.Item
          name="exchange_rate"
          label="Exchange Rate"
          rules={[
            {
              required: true
            }
          ]}
        >
          <InputNumber />
        </Form.Item>
        )
        <Form.Item label="Update Price Per Share">
          <Button
            type="primary"
            onClick={getLivePrice}
            danger
            style={{
              marginRight: '8px',
              marginBottom: '12px'
            }}
          >
            Get Live Price
          </Button>
        </Form.Item>
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
        {portfolioInfo.competition_portfolio ? (
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="Buying Power" value={portfolioInfo.buying_power} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="Event Value" value={pricePerShare * units} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic
                title="New Add Buying Power"
                value={portfolioInfo.buying_power - pricePerShare * units}
                precision={2}
                valueStyle={{
                  color: getColorOfValue(portfolioInfo.buying_power - pricePerShare * units)
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="New Remove Buying Power"
                value={portfolioInfo.buying_power + pricePerShare * units}
                precision={2}
              />
            </Col>
          </Row>
        ) : null}
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Currently Holding" value={holdings} precision={2} />
          </Col>
          <Col span={6}>
            <Statistic title="Units" value={units ? units : 0} precision={2} />
          </Col>
          <Col span={6}>
            <Statistic title="New Add Units" value={holdings + units} precision={2} />
          </Col>
          <Col span={6}>
            <Statistic
              title="New Remove Units"
              value={holdings - units}
              precision={2}
              valueStyle={{ color: getColorOfValue(holdings - units) }}
            />
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={() => setAddActionValue(true)}
            htmlType="submit"
            style={{
              marginRight: '8px',
              marginBottom: '12px'
            }}
            disabled={
              (portfolioInfo.competition_portfolio &&
                portfolioInfo.buying_power - pricePerShare * units < 0) ||
              units <= 0
            }
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
            disabled={holdings - units < 0 || units <= 0}
          >
            Remove
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PortfolioAssetEditForm
