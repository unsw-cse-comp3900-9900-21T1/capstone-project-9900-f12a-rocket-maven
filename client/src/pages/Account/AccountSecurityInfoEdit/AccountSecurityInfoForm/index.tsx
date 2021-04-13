import PasswordInput from '@rocketmaven/components/PasswordInput'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useUpdateAccountInfo } from '@rocketmaven/hooks/http'
import { Investor } from '@rocketmaven/pages/Account/types'
import { Button, Form, Input } from 'antd'
import { Fragment } from 'react'

type Props = {
  investorData: Investor
}

const AccountSecurityInfoForm = ({ investorData }: Props) => {
  const myFetch: Function = useUpdateAccountInfo()
  const onFinish = (values: any) => {
    console.log('*************** values are ', values)
    myFetch({
      ...values,
      confirm: undefined
    })
  }

  return (
    <Fragment>
      <Subtitle>Security Edit</Subtitle>
      <Card title="Change Password">
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

          <PasswordInput label="New Password" />

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

          {/*
          <Form.Item label="Public" name="visibility">
            <Switch defaultChecked={investorData.investor.visibility} />
          </Form.Item>
          */}

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
