import React, { useEffect, useState } from 'react'
// import { urls } from '@rocketmaven/data/urls'
// import Page from '@rocketmaven/pages/_Page'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Button } from '@rocketmaven/componentsStyled/Button'
// import { Title } from '@rocketmaven/componentsStyled/Typography'
import { Form, DatePicker, Radio, Input, Select } from 'antd'
const { RangePicker } = DatePicker
const { Option } = Select

// https://reactrouter.com/web/example/query-parameters
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const ReportGenerate = () => {
  let query = useQuery()

  const onFinish = (values: any) => {}
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
    optionsValue = 'Divestification'
  }
  if (query.get('prefab') == 'tax') {
    optionsValue = 'Tax'
  }

  const options = [
    { label: 'Metrics', value: 'Metrics' },
    { label: 'Tax', value: 'Tax' },
    { label: 'Trade', value: 'Trade' },
    { label: 'Divestification', value: 'Divestification' }
  ]

  function handleChange(value: any) {
    console.log(`Selected: ${value}`)
  }

  const [size, setSize] = React.useState('default')

  const handleSizeChange = (e: any) => {
    setSize(e.target.value)
  }

  const children = []
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i} value={i.toString(36) + i}>
        {i.toString(36) + i}
      </Option>
    )
  }

  return (
    <div>
      <Card title="Generate Report">
        <Form name="normal_report" className="report-form" onFinish={onFinish}>
          <Form.Item label="Portfolios" name="portfolios">
            <Select
              mode="multiple"
              placeholder="Please select"
              defaultValue={['a10', 'c12']}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              {children}
            </Select>
          </Form.Item>

          <Form.Item label="Date Range" name="start_date">
            <RangePicker />
          </Form.Item>

          <Form.Item label="Report Type" name="report_type">
            <Radio.Group
              options={options}
              defaultValue={optionsValue}
              value={optionsValue}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

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
    </div>
  )
}

export default ReportGenerate
