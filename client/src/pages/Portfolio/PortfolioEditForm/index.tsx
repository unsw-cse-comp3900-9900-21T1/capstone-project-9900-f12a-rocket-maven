 import * as Yup from 'yup'
import { Fragment } from 'react'
import { Formik, Field, ErrorMessage } from 'formik'
import { Form, Input, Button,  Card} from 'antd';
// import { MySelect, MyTextInput } from '../../../forms'
import { numberRequired, stringRequired, booleanRequired} from '../../../forms/validators'
import { useFetchMutationWithUserId } from '../../../hooks/http'
import { PortfolioInfo } from '../types'

const schema = Yup.object({
  competition_portfolio: booleanRequired,
  description: stringRequired,
  name: stringRequired,
  tax_residency: stringRequired,
  visibility: booleanRequired,
})
type Props = {
  portfolioInfo?: {
    portfolio: PortfolioInfo
  }
  portfolioId?: string
}

const PortfolioEditForm = ({portfolioInfo, portfolioId}: Props) => {
  let initialValues: PortfolioInfo = {
    competition_portfolio: false,
    description: '',
    name: '',
    tax_residency: '',
    // TODO(Jude): Add visibility
    visibility: true,

    // Bottom 2 not used, just here for typing validation
    creation_date: '',
    id: 0,
  }
  let urlEnd = '/portfolios'
  if (portfolioInfo) {
    initialValues = {...portfolioInfo.portfolio}
    urlEnd = urlEnd + `/${portfolioId}`
  }
  console.log("**************** initial values are", initialValues)
  // Will add redirect after we get some seed data. Right now it's useful to be able to populate
  // values quickly
  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, portfolioInfo ? 'PUT' : 'POST')


  const onFinish = (values: any) => {
    setValuesAndFetch({
            ...values,
            id: undefined,
            creation_date: undefined,
    })
  };
  

  return (
    <Card  style={{
      margin:"60px"
    }}>  
      <Form
        name="portfolio_edit"
        className="portfolio-edit-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Portfolio Name" />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{
   marginRight: "10px"
    }}>
            Edit
          </Button>
        </Form.Item>
      </Form>
    </Card>        
  );


}

export default PortfolioEditForm