import PasswordInput from '@rocketmaven/components/PasswordInput'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { usePasswordReset } from '@rocketmaven/hooks/http'
import Page from '@rocketmaven/pages/_Page'
import { Button, Form, Input } from 'antd'

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18
  }
}

const PasswordReset = () => {
  const resetPassword = usePasswordReset()

  const onFinish = async (values: any) => {
    const urlParams = new URLSearchParams(window.location.search)
    values.evc = urlParams.get('key')
    resetPassword({ values, redirectPath: urls.root })
  }

  return (
    <Page>
      <Title>Enter New Password</Title>
      <Card>
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <PasswordInput />

          <Form.Item
            name="confirmation"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!'
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
          <Form.Item label="Username" style={{ display: 'none' }}>
            <Input type="text" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Page>
  )
}

export default PasswordReset
