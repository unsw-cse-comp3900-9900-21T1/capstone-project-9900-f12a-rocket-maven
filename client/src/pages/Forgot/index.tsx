import Page from '@rocketmaven/pages/_Page'
import { useState } from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { urls } from '@rocketmaven/data/urls'
import { Investor } from '@rocketmaven/pages/Account/types';

const Forgot = () => {

  const [isLoading, setIsLoading] = useState(false)
  const routerObject = useHistory()

  const onFinish = async (values: any) => {
    // TODO(Jude): Create hook and replace useState functio
    try {
      setIsLoading(true)
      const response = await fetch( '/api/v1/iforgot',{
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
      if (response.ok) {
        alert("Password reset sent to email")
      } else {
        throw (response)
      }

      const data: Investor = await response.json()
      setIsLoading(false)
      // TODO(Jude) pass userID to tolink
      // TODO(Jude) make secure
      // TODO(Jude) Bring up why the schema is incorrect
      console.log("*****************8 data is ", data)
    } catch (error) {
      alert(`Something went wrong: ${error.status} ${error.statusText}`)
      setIsLoading(false)
    }
  };

  return (
    <Page>
    <Card>  
      <Form
        name="normal_login"
        className="forgot-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
            disabled={isLoading}
            loading={isLoading}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Card>   
    </Page>     
  );
};

export default Forgot
