import UserAssetSearchBox from '@rocketmaven/components/UserAssetSearchBox'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { urls } from '@rocketmaven/data/urls'
import { useAddPortfolioEvent } from '@rocketmaven/hooks/http'
import { PortfolioEventCreate, PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Statistic, TimePicker } from 'antd'
import moment, { Moment } from 'moment'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory, useLocation, withRouter } from 'react-router-dom'

interface PropsInterface extends RouteComponentProps {
  portfolioId: string
  portfolioInfo: PortfolioInfo
}

type Props = PropsInterface

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

// https://reactrouter.com/web/example/query-parameters
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const PortfolioAssetEditForm = ({ portfolioId, portfolioInfo }: Props) => {
  const [addActionValue, setAddActionValue] = useState(true)
  const [holdings, setHoldings] = useState(0)
  const [pricePerShare, setPricePerShare] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [currentTicker, setCurrentTicker] = useState('')
  const [currentCurrency, setCurrentCurrency] = useState('AUD')
  const [eventDate, setEventDate] = useState<Moment>(moment().seconds(0).milliseconds(0))
  const [units, setUnits] = useState(1)
  const [form] = Form.useForm()
  const query = useQuery()
  const routerObject = useHistory()

  const initialValues: PortfolioEventCreate = {
    add_action: addActionValue,
    asset_id: '',
    fees: 0,
    note: '',
    price_per_share: 0,
    units: 1,
    exchange_rate: 1,
    event_date: eventDate
  }

  const myFetch: Function = useAddPortfolioEvent(portfolioId)

  useEffect(() => {
    if (query.get('stock_ticker')) {
      if (query.get('stock_ticker') !== form.getFieldValue('asset_id')) {
        form.setFieldsValue({
          asset_id: { key: query.get('stock_ticker')!, value: query.get('stock_ticker')! }
        })
        setCurrentTicker(query.get('stock_ticker')!)
        if (query.get('current_price')) {
          form.setFieldsValue({
            price_per_share: parseFloat(query.get('current_price')!)
          })
          setPricePerShare(parseFloat(query.get('current_price')!))
        }
        if (query.get('holdings')) {
          setHoldings(parseFloat(query.get('holdings')!))
        }
      }
    }
  }, [query])

  const onFinish = (values: any) => {
    values.asset_id = values.asset_id.value
    values.add_action = addActionValue
    values.event_date = eventDate
    myFetch({
      values,
      redirectPath: urls.portfolio
    })
  }

  const getColorOfValue = (value: number) => {
    return value < 0 ? 'red' : 'green'
  }

  const getLivePrice = () => {
    const myFetch = async () => {
      try {
        const response = await fetch(
          `/api/v1/assets/${currentTicker}/${portfolioInfo.currency}/price`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )
        if (!response.ok) {
          throw Error(`${response.status}`)
        }
        const data = await response.json()
        setPricePerShare(data.price)
        form.setFieldsValue({
          price_per_share: data.price
        })
        setCurrentCurrency(data.currency)
        setExchangeRate(data.exchange)
        form.setFieldsValue({
          exchange_rate: data.exchange
        })
      } catch (error) {}
    }
    myFetch()
  }

  return (
    <Card className="asset-event-add-card">
      <Form
        name="normal_assetadd"
        className="assetadd-form"
        form={form}
        initialValues={{
          remember: true,
          ...initialValues
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
              console.log(newValue.label.props)
              setHoldings(parseFloat(newValue.label.props['data-holdings']))
              setPricePerShare(newValue.label.props.title)
              setExchangeRate(parseFloat(newValue.label.props['data-exchange']))
              setCurrentTicker(newValue.value)
              setCurrentCurrency(newValue.label.props['data-currency'])
              form.setFieldsValue({
                price_per_share: parseFloat(newValue.label.props.title),
                exchange_rate: parseFloat(newValue.label.props['data-exchange'])
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
          <InputNumber min={1} onChange={(e: any) => setUnits(e)} />
        </Form.Item>
        {!portfolioInfo.competition_portfolio ? (
          <Form.Item
            name="price_per_share"
            label={`Price Per Unit (${currentCurrency})`}
            rules={[
              {
                required: true
              }
            ]}
          >
            <InputNumber
              min={0}
              onChange={(price: number) => {
                if (query.has('current_price')) {
                  query.delete('current_price')
                }
                if (query.has('stock_ticker')) {
                  query.delete('stock_ticker')
                }
                if (query.has('holdings')) {
                  query.delete('holdings')
                }

                routerObject.replace({
                  search: query.toString()
                })
                setPricePerShare(price)
              }}
            />
          </Form.Item>
        ) : (
          <span>
            <Form.Item name="price_per_share" label={`Price Per Unit (${currentCurrency})`}>
              <Input disabled />
            </Form.Item>
          </span>
        )}

        {!portfolioInfo.competition_portfolio && currentCurrency !== portfolioInfo.currency ? (
          <Form.Item
            name="exchange_rate"
            label={`Exchange Rate (${currentCurrency} ➔ ${portfolioInfo.currency})`}
            rules={[
              {
                required: true
              }
            ]}
          >
            <InputNumber min={0.000000001} step={0.01} onChange={(e: any) => setExchangeRate(e)} />
          </Form.Item>
        ) : (
          <span>
            <Form.Item
              name="exchange_rate"
              label={`Exchange Rate (${currentCurrency} ➔ ${portfolioInfo.currency})`}
            >
              <Input disabled />
            </Form.Item>
          </span>
        )}

        {!portfolioInfo.competition_portfolio ? (
          <>
            <Form.Item
              label={`Event Date`}
              rules={[
                {
                  required: true
                }
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                defaultValue={eventDate}
                onChange={(e: any) => {
                  if (e) {
                    setEventDate(eventDate.year(e.year()).month(e.month()).date(e.date()))
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label={`Event Time`}
              rules={[
                {
                  required: true
                }
              ]}
            >
              <TimePicker
                format="HH:mm:ss"
                defaultValue={eventDate}
                onChange={(e: any) => {
                  if (e) {
                    setEventDate(
                      eventDate.hours(e.hours()).minutes(e.minutes()).seconds(e.seconds())
                    )
                  }
                }}
              />
            </Form.Item>
          </>
        ) : null}

        <Form.Item label={`Price Per Unit (${portfolioInfo.currency})`}>
          <Input disabled value={(pricePerShare * exchangeRate).toFixed(2)} />
        </Form.Item>

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
              <Statistic
                title="Event Value"
                value={pricePerShare * exchangeRate * units}
                precision={2}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="New Add Buying Power"
                value={portfolioInfo.buying_power - pricePerShare * exchangeRate * units}
                precision={2}
                valueStyle={{
                  color: getColorOfValue(
                    portfolioInfo.buying_power - pricePerShare * exchangeRate * units
                  )
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="New Remove Buying Power"
                value={portfolioInfo.buying_power + pricePerShare * exchangeRate * units}
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
                portfolioInfo.buying_power - pricePerShare * exchangeRate * units < 0) ||
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

export default withRouter(PortfolioAssetEditForm)
