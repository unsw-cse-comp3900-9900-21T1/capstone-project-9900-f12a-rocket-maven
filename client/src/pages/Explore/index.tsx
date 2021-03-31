import Page from '@rocketmaven/pages/_Page'
import { Form, Input, Button, Row, Col} from 'antd';
import { urls } from '@rocketmaven/data/urls';
import { Investor } from '@rocketmaven/pages/Account/types';
import { Card } from '@rocketmaven/componentsStyled/Card'
import { SearchOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import { useState, useRef, useMemo } from 'react'
import { isEmpty } from  'ramda'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '@rocketmaven/hooks/http'
import { url } from 'node:inspector';
import { Link } from 'react-router-dom';


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
  label: React.ReactNode;
  value: string;
  key: string;
}


async function fetchUserList(query: string): Promise<DebounceValue[]> {

  return fetch(`/api/v1/assets/search?q=${query}&per_page=10`)
    .then(response => response.json())
    .then(data => {
        if (!data || isEmpty(data) || !data.hasOwnProperty("next")) {
        } else {
        const histories:[AssetSearch] = (data as AssetSearchPagination).results;
        
        const search_simple = histories.map(item => {
          return {"key": item.ticker_symbol, "value": item.ticker_symbol, "label": <span title={item.current_price.toString()}>{item.ticker_symbol + " | " + item.name}</span>}
              
        })
        
        return search_simple;
        }
        
        return [];
      }
      )
      
}



const Explore = () => {
    const [ addActionValue, setAddActionValue ] = useState(true);
    const [ valued, setValued ] = useState();
    const [ price, setPrice ] = useState();
    const [form] = Form.useForm();
  

  
    // const onFinish = (values: any) => {
    //   values.asset_id = values.asset_id.value
    //   values.add_action = addActionValue
    //   console.log("************** values are ", values)
    //   setValuesAndFetch({
    //           ...values
    //   })
    // }


    return(
        <Page>
            <Row justify="center"  style={{minHeight:'100vh'}}>
            <Col style={{height:'100vh'}}>

                <h1>Rocket Maven</h1>

                <Form
                    name="explore"
                    className="explore-form"
                    initialValues={{
                    remember: true,
                    }}
                > 
                    <Form.Item
                        name="exploreForm"
                        rules={[
                            {
                            required: false,
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
                        console.log(newValue);

                        }}
                        
                        style={{ width: '500px' }}
                    />

                    </Form.Item>

                </Form>

                <Button type="primary"><Link to={urls.leaderboard}>Rocket Maven Portfolio Competition Leaderboard</Link></Button>
                
                      

            </Col>
            </Row>
        </Page>
    
    );
}

export default Explore

