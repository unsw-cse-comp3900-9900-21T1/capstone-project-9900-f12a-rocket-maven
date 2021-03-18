import { Fragment, useState } from 'react'
import { Subtitle } from '../../../../componentsStyled/Typography'
import { useFetchMutationWithUserId } from '../../../../hooks/http'
import { Card } from '../../../../componentsStyled/Card'
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { Investor } from '../../types'
import { useSortedCountryList } from '../../../../hooks/store'
import { urls } from '../../../../data/urls'

type Props = {
  investorData: Investor
}

const AccountPersonalInfoForm = ({investorData}: Props) => {
  const countryList = useSortedCountryList()
  const setValuesAndFetch: Function = useFetchMutationWithUserId('', 'PUT', urls.account)
  const onFinish = (values: any) => {
    setValuesAndFetch({
      ...values,
    })
  }

  // Get the country code of the name returned
  const countryElement = countryList.find( element => investorData.investor.country_of_residency === element[1])

  return (
    <Fragment>
      <Subtitle>
        Account Edit
      </Subtitle>
    <Card>
      <Form
        name="account_personal_info"
        className="account-personal-info"
        initialValues={{
          ...investorData.investor,
          country_of_residency: countryElement ? countryElement[0] : ''
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input  />
        </Form.Item>

        <Form.Item
          name="first_name"
          label="First Name"
        >
          <Input  />
        </Form.Item>
        <Form.Item
          name="last_name"
          label="Last Name"
        >
          <Input  />
        </Form.Item>
        <Form.Item
          label="Country of residency"
          name="country_of_residency"
          rules={[
            {
              required: true,
              message: 'Please select a country',
            },
          ]}
        >
          <Select
            showSearch>
            {
              countryList.map(([code, name], value) => {
                return(
                  <Select.Option value={code}>{name}</Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="date_of_birth"
          label="Date of Birth"
          rules={[
            {
              required: false,
            },
            () => ({
              validator(_, value) {
                if (value.length == 0 || /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(value)) {
                  return Promise.resolve();
                }
                // Maybe add better date processing?
                return Promise.reject(new Error('Please make sure the date is of the format YYYY-MM-DD'));
              },
            }),
          ]}
        >
          <Input />
          {/*<DatePicker
            format="YYYY-MM-DD"
            />*/}
        </Form.Item>
        <Form.Item style={{textAlign: "center"}} >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "8px", marginBottom: "12px"}}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
    </Fragment>
  )
}

export default AccountPersonalInfoForm
