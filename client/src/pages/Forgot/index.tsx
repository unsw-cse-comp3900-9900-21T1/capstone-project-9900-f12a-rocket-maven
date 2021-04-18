import { UserOutlined } from '@ant-design/icons'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { useIForgot } from '@rocketmaven/hooks/http'
import Page from '@rocketmaven/pages/_Page'
import { Button, Form, Input, message } from 'antd'

const Forgot = () => {
  const { isLoading, myFetch } = useIForgot()
  const onFinish = async (values: any) => {
    const data = await myFetch({ values })
    data && message.info(data.msg)
  }
  return (
    <Page>
      <Card>
        <Form
          name="normal_login"
          className="forgot-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!'
              }
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: '10px' }}
              disabled={isLoading}
              loading={isLoading}
            >
              Request Password Reset
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Page>
  )
}

export default Forgot
