import { useStore } from '@rocketmaven/hooks/store'
import { Select, Spin } from 'antd'
import { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { isEmpty } from 'ramda'
import { useMemo, useRef, useState } from 'react'

type AssetSearch = {
  ticker_symbol: string
  asset_additional: string
  market_cap: number
  country: string
  name: string
  industry: string
  current_price: number
  price_last_updated: Date
  currency: string
  data_source: string
  available_units: number
}

type AssetSearchPagination = {
  results: [AssetSearch]
}

// https://ant.design/components/select/#components-select-demo-select-users
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>
  debounceTimeout?: number
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<ValueType[]>([])
  const fetchRef = useRef(0)

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }

        setOptions(newOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select<ValueType>
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}

// Usage of DebounceSelect
interface DebounceValue {
  label: React.ReactNode
  value: string
  key: string
}

const UserAssetSearchBox = (props: any) => {
  const { accessToken } = useStore()
  async function fetchUserList(query: string): Promise<DebounceValue[]> {
    return fetch(`/api/v1/assets/search/${props.portfolioid}?q=${query}&per_page=10`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || isEmpty(data) || !data.hasOwnProperty('results')) {
        } else {
          const histories: [AssetSearch] = (data as AssetSearchPagination).results

          const search_simple = histories.map((item) => {
            return {
              key: item.ticker_symbol,
              value: item.ticker_symbol,
              label: (
                <span
                  title={item.current_price.toString()}
                  data-holdings={item.available_units.toString()}
                >
                  {item.ticker_symbol + ' | ' + item.name}
                </span>
              )
            }
          })

          return search_simple
        }

        return []
      })
  }

  return <DebounceSelect placeholder="Search Asset" fetchOptions={fetchUserList} {...props} />
}

export default UserAssetSearchBox
