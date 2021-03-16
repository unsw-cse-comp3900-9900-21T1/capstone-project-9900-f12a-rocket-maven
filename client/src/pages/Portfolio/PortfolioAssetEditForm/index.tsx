import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button,  Card} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { urls } from '../../../data/urls'
import { useAuth } from '../../../hooks/http'

const PortfolioAssetEditForm = () => {

  const setValuesAndFetch = useAuth('LOGIN')
  const onFinish = (values: any) => {
    setValuesAndFetch(values)
  };

  return (
    <Card  style={{
      margin:"60px"
    }}>  
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{
   marginRight: "10px"
    }}>
          Add Asset
          </Button>
        </Form.Item>
      </Form>
    </Card>        
  );
};

export default PortfolioAssetEditForm
