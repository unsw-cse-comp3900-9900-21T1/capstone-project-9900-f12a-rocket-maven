import { Fragment } from 'react'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Form, Input, Button, Switch, Select } from 'antd'
import { useSortedCountryList } from '@rocketmaven/hooks/store'
// import { MySelect, MyTextInput } from '@rocketmaven/forms'
import { numberRequired, stringRequired, booleanRequired } from '@rocketmaven/forms/validators'
import { useFetchMutationWithUserId, useUpdatePortfolioInfo } from '@rocketmaven/hooks/http'
import { PortfolioInfoEdit } from '@rocketmaven/pages/Portfolio/types'
import { urls } from '@rocketmaven/data/urls'
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
  let initialValues: PortfolioInfoEdit = {
    competition_portfolio: false,
    description: '',
    name: '',
    tax_residency: '',
    public_portfolio: true,
    // Bottom 2 not used, just here for typing validation
    creation_date: '',
    id: 0
  }
  let countryElement: [string, string] = ['AU', 'Australia']
  if (portfolioInfo) {
    initialValues = { ...portfolioInfo.portfolio }
    // Get the country code of the name returned
    countryElement = countryList.find(
      (element) => portfolioInfo.portfolio.tax_residency === element[1]
    ) as [string, string]
  }
  const setValuesAndFetch: Function = useUpdatePortfolioInfo(
    portfolioInfo ? 'PUT' : 'POST',
    portfolioId,
  )
  const onFinish = (values: any) => {
    setValuesAndFetch({
      ...values,
      id: undefined,
      creation_date: undefined
    })
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
            <Select>
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

        <Form.Item label="Public" name="public_portfolio">
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
