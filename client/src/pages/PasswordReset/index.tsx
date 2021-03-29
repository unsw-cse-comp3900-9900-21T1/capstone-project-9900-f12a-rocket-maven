import Page from '../_Page'
import { useHistory, Redirect } from 'react-router-dom'
import { Card } from '../../componentsStyled/Card'
import { Form, Input, Button, message } from 'antd'
import { Title } from '../../componentsStyled/Typography'
import PasswordInput from '../../components/PasswordInput'
import 'antd/dist/antd.css'

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
  const routerObject = useHistory()
  const onFinish = async (values: any) => {
    // Double check that the password reset works in the browser we're going to demo it in
    // Briefly read that URLSearchParams may not have extensive support
    const urlParams = new URLSearchParams(window.location.search)
    values.evc = urlParams.get('key')
    try {
      const response = await fetch('/api/v1/pw_reset', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      const data = await response.json()
      if (!response.ok) {
        throw Error(`${data.msg}`)
      }
      routerObject.push('/')
      message.success(`${data.msg}`);
    } catch (error) {
      message.error(error);
    }
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
