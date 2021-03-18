import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button, Card } from 'antd';
import { urls } from '../../../data/urls'
import { useState, useRef, useMemo } from 'react'
import { useHistory } from "react-router";
import { SelectProps } from "antd/es/select";
import { isEmpty } from  'ramda'
import { PortfolioInfo, PortfolioEventCreate } from '../types'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '../../../hooks/http'

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

export type AssetSearch = {
    ticker_symbol:      string;
    asset_additional:   string;
    market_cap:         number;
    country:            string;
    name:               string;
    industry:           string;
    current_price:      number;
    price_last_updated: Date;
    currency:           string;
    data_source:        string;
}
    
export type AssetSearchPagination = {
  next: string,
  pages: number,
  prev: string,
  total: number,
  results: [AssetSearch]
}


type Props = {
  portfolioId?: string
}

// https://ant.design/components/select/#components-select-demo-select-users
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect
interface DebounceValue {
  label: string;
  value: string;
  key: string;
}


async function fetchUserList(query: string): Promise<DebounceValue[]> {

  return fetch(`/api/v1/assets/search?q=${query}&per_page=10`)
    .then(response => response.json())
    .then(data => {
        console.log(data.next);
        if (!data || isEmpty(data) || !data.next) {
        } else {
        const histories:[AssetSearch] = (data as AssetSearchPagination).results;
        
        const search_simple = histories.map(item => {
          return {"key": item.ticker_symbol, "value": item.ticker_symbol, "label": item.ticker_symbol + " | " + item.name}
        })
        
        return search_simple;
        }
        
        return [];
      }
      )
      
}


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


const PortfolioAssetEditForm = ({portfolioId}: Props) => {

  const [ addActionValue, setAddActionValue ] = useState(true);
  const [ valued, setValued ] = useState();

  let initialValues: PortfolioEventCreate = {
    add_action: addActionValue,
    asset_id: "",
    fees: 0,
    note: "",
    price_per_share: 0,
    units: 0
  }
  let urlEnd = `../../../portfolios/${portfolioId}/history`

  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, 'POST', urls.portfolio)

  const onFinish = (values: any) => {
    values.asset_id = values.asset_id.value
    values.add_action = addActionValue
    console.log("************** values are ", values)
    setValuesAndFetch({
            ...values
    })
  }




  return (
    <Card  style={{
      width:"600px"
    }}>  
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Form.Item
          name="asset_id"
          label="Ticker (EXCHANGE:SYMBOL)" 
          rules={[
            {
              required: true,
              message: 'Please input a ticker!',
            },
          ]}
        >
            
                  
          <DebounceSelect
          showSearch
            value={valued}
            placeholder="Search Asset"
            fetchOptions={fetchUserList}
            onChange={newValue => {
              setValued(newValue.key);
            }}
            style={{ width: '100%' }}
          />
          
          
        </Form.Item>
        
        
        
        <Form.Item
          name="fees"
          label="Fees"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input  />
        </Form.Item>
        
        <Form.Item
          name="units"
          label="Units"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input  />
        </Form.Item>
        
        
        <Form.Item
          name="price_per_share"
          label="Price Per Unit"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input  />
        </Form.Item>
        
        
        <Form.Item
          name="note"
          label="Note"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input  />
        </Form.Item>
        
        

          {/* <Button type="primary" onClick={() => setAddActionValue(true)} htmlType="submit" value={addActionValue} style={{ */}
        <Form.Item style={{textAlign: "center"}} >
          <Button type="primary" onClick={()=>setAddActionValue(true)} htmlType="submit" style={{
   marginRight: "8px",
   marginBottom: "12px",
    }}>
          Add
          </Button>
          <Button type="primary" onClick={()=>setAddActionValue(false)} htmlType="submit" danger style={{
   marginRight: "8px",
   marginBottom: "12px",
    }}>
          Remove
          </Button>
        </Form.Item>
      </Form>
    </Card>        
  );
};

export default PortfolioAssetEditForm
