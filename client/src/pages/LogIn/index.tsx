import Page from '../_Page'
import { Fragment } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'

import { Card } from '../../componentsStyled/Card'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { urls } from '../../data/urls'
import { useAuth } from '../../hooks/http'

const LogIn = () => {
  const setValuesAndFetch = useAuth('LOGIN')
  const onFinish = (values: any) => {
    setValuesAndFetch(values)
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
