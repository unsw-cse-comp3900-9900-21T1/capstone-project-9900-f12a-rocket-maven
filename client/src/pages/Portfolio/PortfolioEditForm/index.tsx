import { Card } from '@rocketmaven/componentsStyled/Card'
// import { MySelect, MyTextInput } from '@rocketmaven/forms'
import { useUpdatePortfolioInfo } from '@rocketmaven/hooks/http'
import { useSortedCountryList, useSortedCurrencyList } from '@rocketmaven/hooks/store'
import { PortfolioInfoEdit } from '@rocketmaven/pages/Portfolio/types'
import { Button, Form, Input, Select, Switch } from 'antd'
import { useState } from 'react'
const { Option } = Select

type Props = {
  portfolioInfo?: {
    portfolio: PortfolioInfoEdit
  }
  portfolioId?: string
  action?: string
}

const PortfolioEditForm = ({ portfolioInfo, portfolioId, action }: Props) => {
  const countryList = useSortedCountryList()
  const currencyList = useSortedCurrencyList()
  const [hideCurrency, setHideCurrency] = useState(false)

  let initialValues: PortfolioInfoEdit = {
    competition_portfolio: false,
    description: '',
    name: '',
    tax_residency: '',
    public_portfolio: true,
    // Bottom 2 not used, just here for typing validation
    creation_date: '',
    currency: 'AUD',
    id: 0
  }

  let countryElement: [string, string] = ['AU', 'Australia']
  let currencyElement: [string, string] = ['AUD', 'Australian Dollars']

  if (portfolioInfo) {
    initialValues = { ...portfolioInfo.portfolio }
    // Get the country code of the name returned
    countryElement = countryList.find(
      (element) => portfolioInfo.portfolio.tax_residency === element[1]
    ) as [string, string]

    currencyElement = currencyList.find(
      (element) => portfolioInfo.portfolio.currency === element[1]
    ) as [string, string]
  }

  const setValuesAndFetch: Function = useUpdatePortfolioInfo(
    portfolioInfo ? 'PUT' : 'POST',
    portfolioId
  )
  const onFinish = (values: any) => {
    console.log(values)
    setValuesAndFetch({
      ...values,
      id: undefined,
      creation_date: undefined
    })
  }

  const actAccordingly = (e: any) => {
    if (e == '0') {
      setHideCurrency(false)
    } else {
      setHideCurrency(true)
    }
  }

  return (
    <Card>
      <Form
        name="portfolio_edit"
        className="portfolio-edit-form"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          initialValue={initialValues.name}
          label="Portfolio Name"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        {action == 'Create' ? (
          <Form.Item
            name="competition_portfolio"
            label="Portfolio Type"
            rules={[{ required: true }]}
          >
            <Select onChange={actAccordingly}>
              <Option value="0">Regular Portfolio</Option>
              <Option value="1">Competition Portfolio</Option>
            </Select>
          </Form.Item>
        ) : null}
        <Form.Item
          name="description"
          initialValue={initialValues.description}
          label="Description"
          rules={[
            {
              required: false
            }
          ]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        {!hideCurrency && (!portfolioInfo || !portfolioInfo.portfolio.competition_portfolio) ? (
          <>
            <Form.Item
              label="Tax Residency"
              name="tax_residency"
              initialValue={countryElement[0]}
              rules={[
                {
                  required: true,
                  message: 'Please select a country'
                }
              ]}
            >
              <Select showSearch>
                {countryList.map(([code, name], value) => {
                  return <Select.Option value={code}>{name}</Select.Option>
                })}
              </Select>
            </Form.Item>
            {action == 'Create' ? (
              <Form.Item
                label="Currency"
                name="currency"
                initialValue={currencyElement[0]}
                rules={[
                  {
                    required: true,
                    message: 'Please select a currency'
                  }
                ]}
              >
                <Select showSearch>
                  {currencyList.map(([code, name], value) => {
                    return <Select.Option value={code}>{name}</Select.Option>
                  })}
                </Select>
              </Form.Item>
            ) : null}
          </>
        ) : null}
        <Form.Item
          label="Public"
          name="public_portfolio"
          initialValue={initialValues.public_portfolio}
        >
          <Switch defaultChecked={initialValues.public_portfolio ? true : false} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginRight: '10px'
            }}
          >
            {action ? action : 'Edit'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PortfolioEditForm
