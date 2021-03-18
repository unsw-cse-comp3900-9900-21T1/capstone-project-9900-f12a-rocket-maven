
import { Fragment } from 'react'
import { Form, Input, Button,  Card, Switch, Select } from 'antd';
// import { MySelect, MyTextInput } from '../../../forms'
import { numberRequired, stringRequired, booleanRequired} from '../../../forms/validators'
import { useFetchMutationWithUserId } from '../../../hooks/http'
import { PortfolioInfoEdit } from '../types'
import { useHistory } from "react-router";
const { Option } = Select;


type Props = {
  portfolioInfo?: {
    portfolio: PortfolioInfoEdit
  }
  portfolioId?: string
  action?: string
}

const PortfolioEditForm = ({portfolioInfo, portfolioId, action}: Props) => {
  let initialValues: PortfolioInfoEdit = {
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

  const routerObject = useHistory()

  const onFinish = (values: any) => {
    setValuesAndFetch({
            ...values,
            id: undefined,
            creation_date: undefined,
    })
    routerObject.push('/portfolio')
  };


  return (
    <Card  style={{
      width:"600px"
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
          initialValue={initialValues.name}
          label="Portfolio Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        
            {action == "Create"?
      <Form.Item name="competition_portfolio" label="Portfolio Type" rules={[{ required: true }]}>
        <Select >
            <Option value="0">Regular Portfolio</Option>
            <Option value="1">Competition Portfolio</Option>
        </Select>
      </Form.Item>
            
            :
            
            null}
            
            
            
            
        <Form.Item
          name="description"
          initialValue={initialValues.description}
          label="Description"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        
      
      <Form.Item name="tax_residency" label="Tax Residency" initialValue={(initialValues.tax_residency.length > 0)?initialValues.tax_residency:"AU"} rules={[{ required: true }]}>
        <Select >
            <Option value="AU">Australia</Option>
            <Option value="US">United States</Option>
            <Option value="GB">England</Option>
            <Option value="XX">Antarctica</Option>
        </Select>
      </Form.Item>
    
    
        <Form.Item label="Public" name="visibility">
          <Switch 
          defaultChecked={initialValues.visibility?true:false} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{
   marginRight: "10px"
    }}>
            {action? action: "Edit"}
          </Button>
        </Form.Item>
      </Form>
    </Card>        
  );


}

export default PortfolioEditForm