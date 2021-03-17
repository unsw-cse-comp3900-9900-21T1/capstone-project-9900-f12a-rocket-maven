import Page from '../_Page'
import { Fragment  } from 'react'
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button,  Card} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { urls } from '../../data/urls'
import { useAuth } from '../../hooks/http'

const Forgot = () => {

  const onFinish = (values: any) => {
    // setValuesAndFetch(values)
  };

  return (
    <Page>
    <Card  style={{
      width:"600px", 
    }}>  
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
          <Button type="primary" htmlType="submit" style={{
   marginRight: "10px"
    }}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Card>   
    </Page>     
  );
};

export default Forgot
