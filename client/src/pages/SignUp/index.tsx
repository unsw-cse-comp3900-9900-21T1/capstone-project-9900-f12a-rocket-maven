import { Form, Input, Button, Select, Card } from 'antd';
import Page from '../_Page'
import 'antd/dist/antd.css';
import { useAuth } from '../../hooks/http'
import { useSortedCountryList } from '../../hooks/store'

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
};

const SignUp =  () => {

  const setValuesAndFetch = useAuth('REGISTER')
  const countryList = useSortedCountryList()
  
  const onFinish = async (values: any) => {
    const requestBody =   {
    "country_of_residency": values.countryOfResidency,
    "date_of_birth": "2021-03-13",
    "email": values.email,
    "first_name": values.firstName,
    "gender": values.gender,
    "last_name": values.lastName,
    "password": values.password,
    "username": values.username,
    "visibility": true
    };
    setValuesAndFetch(requestBody)
  };

  return (
    <Page>
    <Card  style={{
      width:"600px",
    }}>

      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: false,
              message: 'Please input your first name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: false,
              message: 'Please input your last name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Country of residency"
          name="countryOfResidency"
          rules={[
            {
              required: true,
              message: 'Please select a country',
            },
          ]}
        >
          <Select>
            {
              countryList.map(([code, name], value) => {
                return(
                  <Select.Option value={code}>{name}</Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
              message: 'Please select a country',
            },
          ]}
        >
          <Select>
              <Select.Option value={'Female'}>Female</Select.Option>
              <Select.Option value={'Male'}>Male</Select.Option>
              <Select.Option value={'Other'}>Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="date_of_birth"
          rules={[
            {
              required: false,
            },
            () => ({
              validator(_, value) {
                if (/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(value)) {
                  return Promise.resolve();
                }
                // Maybe add better date processing?
                return Promise.reject(new Error('Please make sure the date is of the format XXXX-XX-XX'));
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
    </Page>
  );
};


export default SignUp
