import React, { useEffect, useState } from 'react'
// import Page from '@rocketmaven/pages/_Page'
import { useHistory } from 'react-router'
import { useStore, useUserId, useIsLoggedIn } from '@rocketmaven/hooks/store'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Button } from '@rocketmaven/componentsStyled/Button'
import MainChart from '@rocketmaven/components/MainChart'
// import { Title } from '@rocketmaven/componentsStyled/Typography'
import { Form, DatePicker, Radio, Input, Select } from 'antd'
import { isEmpty } from 'ramda'
const { RangePicker } = DatePicker
const { Option } = Select

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

// https://reactrouter.com/web/example/query-parameters
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const ReportGenerate = () => {
  let query = useQuery()

  const { accessToken, refreshToken, dispatch } = useStore()

  const [children, setChildren] = React.useState([])
  const [defaultChildren, setDefaultChildren] = React.useState(false)
  const [hideDate, setHideDate] = React.useState(false)

  const [seriesData, setSeriesData] = React.useState([])
  const [drilldownData, setDrilldownData] = React.useState([])

  const [reportMode, setReportMode] = React.useState('')

  // https://www.highcharts.com/demo/pie-drilldown
  let chartOptions = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Diversification'
    },
    subtitle: {
      text: 'Portfolios by Industry Diversity'
    },

    accessibility: {
      announceNewData: {
        enabled: true
      },
      point: {
        valueSuffix: '%'
      }
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y:.1f}%',
          distance: -30
        },
        showInLegend: true
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: seriesData,
    drilldown: drilldownData
  }

  const onFinish = async (values: any) => {
    setReportMode(values.report_type)
    values.portfolios = defaultChildren
    // values.portfolios =
    const response = await fetch(`/api/v1/report`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(values)
    })
    const data = await response.json()
    setDrilldownData(data['drilldown'])
    setSeriesData(data['series'])
    if (!response.ok) {
      throw Error(`${data.msg}`)
    }
  }

  let optionsValue = 'Metrics'

  if (query.get('prefab') == 'all-time') {
  }
  if (query.get('prefab') == 'year') {
  }
  if (query.get('prefab') == 'monthly') {
  }
  if (query.get('prefab') == 'trades') {
    optionsValue = 'Trade'
  }
  if (query.get('prefab') == 'diversification') {
    optionsValue = 'Diversification'
  }
  useEffect(() => {
    if (query.get('prefab') == 'diversification') {
      setHideDate(true)
    }
  }, [])
  if (query.get('prefab') == 'tax') {
    optionsValue = 'Tax'
  }

  const options = [
    { label: 'Metrics', value: 'Metrics' },
    { label: 'Tax', value: 'Tax' },
    { label: 'Trade', value: 'Trade' },
    { label: 'Diversification', value: 'Diversification' }
  ]

  function handleChange(value: any) {
    console.log(`Selected: ${value}`)
    setDefaultChildren(value)
  }

  const [size, setSize] = React.useState('default')

  const handleSizeChange = (e: any) => {
    setSize(e.target.value)
  }

  const [refreshFlag, setRefreshFlag] = useState(0)
  const refreshPortfolios = () => setRefreshFlag(refreshFlag + 1)

  const { data, isLoading }: PortfolioListFetchResults = useFetchGetWithUserId(
    '/all_portfolios',
    refreshFlag
  )

  const actAccordingly = (e: any) => {
    if (e.target.value == 'Diversification') {
      setHideDate(true)
    } else {
      setHideDate(false)
    }
  }

  useEffect(() => {
    if (data && !isEmpty(data)) {
      let tmpChildren: any = []
      let tmpChildren2: any = data.results.map(function (e) {
        tmpChildren.push(e.id)
        return (
          <Option key={e.id} value={e.id}>
            #{e.id} - {e.name}
          </Option>
        )
      })
      setDefaultChildren(tmpChildren)
      setChildren(tmpChildren2)
    }
  }, [data])

  return (
    <div>
      <Card title="Generate Report">
        <Form name="normal_report" className="report-form" onFinish={onFinish}>
          <Form.Item label="Report Type" name="report_type" initialValue={optionsValue}>
            <Radio.Group
              options={options}
              defaultValue={optionsValue}
              value={optionsValue}
              onChange={actAccordingly}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

          {defaultChildren ? (
            <Form.Item
              label="Portfolios"
              name="portfolios"
              initialValue={defaultChildren}
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                placeholder="Please select"
                onChange={handleChange}
                style={{ width: '100%' }}
              >
                {children}
              </Select>
            </Form.Item>
          ) : null}

          {!hideDate ? (
            <Form.Item label="Date Range" name="date_range">
              <RangePicker />
            </Form.Item>
          ) : null}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginRight: '10px'
              }}
            >
              Generate
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {seriesData.length > 0 && 'series' in drilldownData && reportMode == 'Diversification' ? (
        <Card>
          <div style={{ height: '70vh', width: '100%' }}>
            <MainChart customType="pie" options={chartOptions} />
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export default ReportGenerate
