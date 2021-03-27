import Page from '../_Page'
import { useState } from 'react'
import { Form, Input, Button} from 'antd';
import { urls } from '../../data/urls';
import 'antd/dist/antd.css';
import { Investor } from '../Account/types';
import { Card } from '../../componentsStyled/Card'
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Explore = () => {




    return(
        <Page>
            <Card>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                    remember: true,
                    }}
                >
                    <Form.Item
                        name="exploreForm"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="exploreContent" />} placeholder="" />
                    </Form.Item>
                    




                </Form>

            </Card>
        </Page>
    
    );
}

export default Explore

