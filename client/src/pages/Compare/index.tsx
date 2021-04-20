import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'
import { Button } from '@rocketmaven/componentsStyled/Button'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { useGetChartData } from '@rocketmaven/hooks/http'
import Page from '@rocketmaven/pages/_Page'
import { Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import MultiAssetGraphCard from './MultiAssetGraphCard'
import { afterSetExtremesPrototype } from './MultiAssetGraphCard/graphDefinitions'

const Compare = () => {
  const [graphData, setGraphData] = useState<any[]>([])
  const [tickers, setTickers] = useState([])
  const [chartRef, setChartRef] = useState<Highcharts.Chart>()
  const [seriesContext, setSeriesContext] = useState<string>('monthly')
  const getChartData = useGetChartData()

  // Curry up references to functions/objects needed to be passed into graph
  const afterSetExtremes = afterSetExtremesPrototype(setChartRef, seriesContext, setSeriesContext)

  const onFinish = async (values: any) => {
    const tmpTickers = values.asset_id.map(function (e: any) {
      return e.value
    })
    message.info(`Now comparing: ${tmpTickers}`)
    setTickers(tmpTickers)
  }

  useEffect(() => {
    let newGraphData: any = []

    tickers.forEach(function (ticker_symbol: string) {
      const myFetch = async () => {
        const api_part = `/chart/${seriesContext}/${ticker_symbol}`
        const data = await getChartData({ apiPath: api_part })
        if (data) {
          newGraphData = [...newGraphData, [ticker_symbol, data]]

          if (newGraphData.length === tickers.length) {
            setGraphData(newGraphData)
            if (chartRef) {
              chartRef.hideLoading()
            }
          }
        }
      }
      myFetch()
    })
  }, [seriesContext, tickers])

  return (
    <Page>
      <Title>Compare Assets</Title>
      <Card title="Asset Selection" className="asset-compare-selector">
        <Form name="normal_asset" className="report-form" onFinish={onFinish}>
          <Form.Item
            name="asset_id"
            label="Ticker (EXCHANGE:SYMBOL)"
            initialValue={[
              { key: 'NASDAQ:AAPL', value: 'NASDAQ:AAPL' },
              { key: 'NASDAQ:MSFT', value: 'NASDAQ:MSFT' }
            ]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.length > 1) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('Please input two or more tickers!'))
                }
              })
            ]}
          >
            <AssetSearchBox mode="multiple" showSearch style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginRight: '10px'
              }}
            >
              Compare
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <MultiAssetGraphCard
        graphData={graphData}
        tickers={tickers}
        afterSetExtremes={afterSetExtremes}
        seriesContext={seriesContext}
      />
    </Page>
  )
}

export default Compare
