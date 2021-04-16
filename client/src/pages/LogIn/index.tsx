import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { urls } from '@rocketmaven/data/urls'
import { useAuth } from '@rocketmaven/hooks/http'
import Page from '@rocketmaven/pages/_Page'
import { Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'

const LogIn = () => {
  const submit = useAuth('LOGIN')
  const onFinish = (values: any) => {
    submit(values)
  }

  return (
    <Page>
      <Card>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!'
              }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <a className="login-form-forgot" href="/forgot">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginRight: '10px'
              }}
            >
              Log in
            </Button>
            Or <Link to={urls.signup}>register now!</Link>
          </Form.Item>
        </Form>
      </Card>
    </Page>
  )
}

export default LogIn
