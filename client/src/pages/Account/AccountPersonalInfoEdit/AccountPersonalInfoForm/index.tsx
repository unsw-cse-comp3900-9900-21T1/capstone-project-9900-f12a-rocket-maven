import { Fragment, useState } from 'react'
import { Subtitle } from '../../../../componentsStyled/Typography'
import { useFetchMutationWithUserId } from '../../../../hooks/http'
import { Form, Input, Button, Card } from 'antd';
import { Investor } from '../../types'
import { urls } from '../../../../data/urls'

type Props = {
  investorData: Investor
}

const AccountPersonalInfoForm = ({investorData}: Props) => {
  const setValuesAndFetch: Function = useFetchMutationWithUserId('', 'PUT')
  const onFinish = (values: any) => {
    setValuesAndFetch({
      ...values,
    })
  }

  return (
    <Fragment>
      <Subtitle>
        Account Edit
      </Subtitle>
    <Card  style={{
      width:"600px"
    }}>  
      <Form
        name="account_personal_info"
        className="account-personal-info"
        initialValues={{...investorData.investor}}
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
        {/* TODO(Jude): Country dropdown and country code mapping */}
        <Form.Item
          name="country_of_residency"
          label="Country of Residency"
        >
          <Input  />
        </Form.Item>
        <Form.Item
          name="date_of_birth"
          label="Date of Birth"
        >
          <Input  />
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