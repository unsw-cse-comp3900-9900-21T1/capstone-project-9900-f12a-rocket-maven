import { Fragment } from 'react'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import PasswordInput from '@rocketmaven/components/PasswordInput'
import { useFetchMutationWithUserId } from '@rocketmaven/hooks/http'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Form, Input, Button, Switch } from 'antd'
import { Investor } from '@rocketmaven/pages/Account/types'
import { urls } from '@rocketmaven/data/urls'

type Props = {
  investorData: Investor
}

const AccountSecurityInfoForm = ({ investorData }: Props) => {
  const setValuesAndFetch: Function = useFetchMutationWithUserId('', 'PUT', urls.account)
  const onFinish = (values: any) => {
    console.log('*************** values are ', values)
    setValuesAndFetch({
      ...values,
      // confirm field removed since it is only to ensule
      confirm: undefined
    })
  }

  return (
    <Fragment>
      <Subtitle>Security Edit</Subtitle>
      <Card>
        <Form
          name="account_security_info"
          className="account-security-info"
          initialValues={{ ...investorData.investor }}
          onFinish={onFinish}
        >
          {/*
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Input />
          </Form.Item>
          */}

          <PasswordInput />

          <Form.Item
            name="confirm"
            label="Confirm New Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject(
                    new Error('The two passwords that you entered do not match!')
                  )
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Public" name="visibility">
            <Switch defaultChecked={investorData.investor.visibility} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: '8px', marginBottom: '12px' }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Fragment>
  )
}

export default AccountSecurityInfoForm
