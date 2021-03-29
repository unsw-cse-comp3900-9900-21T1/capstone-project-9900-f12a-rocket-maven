
import { Fragment } from 'react'
import { Card } from '../../../componentsStyled/Card'
import { Form, Input, Button, Switch, Select } from 'antd';
import { useSortedCountryList } from '../../../hooks/store'
// import { MySelect, MyTextInput } from '../../../forms'
import { numberRequired, stringRequired, booleanRequired} from '../../../forms/validators'
import { useFetchMutationWithUserId } from '../../../hooks/http'
import { PortfolioInfoEdit } from '../types'
import { urls } from '../../../data/urls'
const { Option } = Select;


type Props = {
  portfolioInfo?: {
    portfolio: PortfolioInfoEdit
  }
  portfolioId?: string
  action?: string
}

const PortfolioEditForm = ({portfolioInfo, portfolioId, action}: Props) => {
  const countryList = useSortedCountryList()
  let initialValues: PortfolioInfoEdit = {
    competition_portfolio: false,
    description: '',
    name: '',
    tax_residency: '',
    // TODO(Jude): Add visibility
    public_portfolio: true,

    // Bottom 2 not used, just here for typing validation
    creation_date: '',
    id: 0,
  }
  let urlEnd = '/portfolios'
  let countryElement: [string, string] = ["AU", "Australia"];
  if (portfolioInfo) {
    initialValues = {...portfolioInfo.portfolio}
    urlEnd = urlEnd + `/${portfolioId}`
    // Get the country code of the name returned
    countryElement = (countryList.find( element => portfolioInfo.portfolio.tax_residency === element[1])) as [string, string]

  }
  console.log("**************** initial values are", initialValues)
  // Will add redirect after we get some seed data. Right now it's useful to be able to populate
  // values quickly
  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, portfolioInfo ? 'PUT' : 'POST', urls.portfolio)

  const onFinish = (values: any) => {
    setValuesAndFetch({
            ...values,
            id: undefined,
            creation_date: undefined,
    })
  };


  return (
    <Card>  

    
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
        
        
        <Form.Item
          label="Tax Residency"
          name="tax_residency"
          initialValue={countryElement[0]}
          rules={[
            {
              required: true,
              message: 'Please select a country',
            },
          ]}
        >
          <Select 
            showSearch>
            {
              countryList.map(([code, name], value) => {
                return(
                  <Select.Option value={code}>{name}</Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>
    
        <Form.Item label="Public" name="public_portfolio">
          <Switch 
          defaultChecked={initialValues.public_portfolio?true:false} />
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