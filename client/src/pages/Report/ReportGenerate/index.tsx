import MainChart from '@rocketmaven/components/MainChart'
import { Button } from '@rocketmaven/componentsStyled/Button'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { useStore } from '@rocketmaven/hooks/store'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { DatePicker, Form, Radio, Select } from 'antd'
import moment from 'moment'
import { isEmpty } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
  const query = useQuery()

  const { accessToken, refreshToken, dispatch } = useStore()

  const [children, setChildren] = React.useState([])
  const [defaultChildren, setDefaultChildren] = React.useState(false)
  const [hideDate, setHideDate] = React.useState(false)

  const [reportMode, setReportMode] = React.useState('')

  const [chartOptions, setChartOptions] = React.useState({})

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

    if (values.report_type == 'Diversification') {
      // https://www.highcharts.com/demo/pie-drilldown
      setChartOptions({
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

        series: data['series'],
        drilldown: data['drilldown']
      })
    }

    if (values.report_type == 'Realised') {
      console.log(data['series'])
      setChartOptions({
        chart: {
          type: 'line'
        },
        xAxis: {
          type: 'datetime'
        },
        title: {
          text: 'Realised'
        },
        subtitle: {
          text: 'Realised Portfolio Values'
        },
        series: data['series']
      })
    }

    if (values.report_type == 'Tax') {
      console.log(data['series'])
      setChartOptions({
        chart: {
          type: 'line'
        },
        xAxis: {
          type: 'datetime'
        },
        title: {
          text: 'Tax'
        },
        subtitle: {
          text: 'Tax Values'
        },
        series: data['series']
      })
    }
  }

  let initDate: any = []

  let optionsValue = 'Realised'

  if (query.get('prefab') == 'all-time') {
  }
  if (query.get('prefab') == 'year') {
    initDate = [moment().subtract(1, 'year'), moment()]
  }
  if (query.get('prefab') == 'monthly') {
    initDate = [moment().subtract(1, 'month'), moment()]
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
    { label: 'Realised', value: 'Realised' },
    { label: 'Tax', value: 'Tax' },
    // { label: 'Trade', value: 'Trade' },
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
      const tmpChildren: any = []
      const tmpChildren2: any = data.results.map(function (e) {
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
            <Form.Item label="Date Range" name="date_range" initialValue={initDate}>
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

      {chartOptions && reportMode == 'Diversification' ? (
        <Card>
          <div style={{ height: '70vh', width: '100%' }}>
            <MainChart customType="pie" options={chartOptions} />
          </div>
        </Card>
      ) : null}
      {chartOptions && (reportMode == 'Realised' || reportMode == 'Tax') ? (
        <Card>
          <div style={{ height: '70vh', width: '100%' }}>
            <MainChart options={chartOptions} />
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export default ReportGenerate
