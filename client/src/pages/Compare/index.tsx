import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'
import MainChart from '@rocketmaven/components/MainChart'
import { Button } from '@rocketmaven/componentsStyled/Button'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { useIsLoggedIn, useStore } from '@rocketmaven/hooks/store'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import Page from '@rocketmaven/pages/_Page'
// import { Title } from '@rocketmaven/componentsStyled/Typography'
import { DatePicker, Form, message, Select } from 'antd'
import { isEmpty } from 'ramda'
import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory } from 'react-router'

const { RangePicker } = DatePicker
const { Option } = Select

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

type Params = {
  ticker_symbol: string
}
type ChartTooltip = {
  chart: any
}
type ChartTooltipTop = {
  top: any
}

const Compare = () => {
  const asset_card = null
  const [graphCard, setGraphCard] = useState<ReactElement>()
  const [graphData, setGraphData] = useState<any[]>([])
  const [tickers, setTickers] = useState([])

  const [chartRef, setChartRef] = useState<Highcharts.Chart>()

  const [seriesContext, setSeriesContext] = useState<string>('monthly')

  const onFinish = async (values: any) => {
    const tmpTickers = values.asset_id.map(function (e: any) {
      return e.value
    })
    message.info(`Now comparing: ${tmpTickers}`)
    setTickers(tmpTickers)
  }

  const seriesIndex = [
    {
      type: 'hour',
      count: 1,
      text: '1h'
    },
    {
      type: 'day',
      type_full: 'daily',
      count: 1,
      text: '1d'
    },
    {
      type: 'week',
      type_full: 'weekly',
      count: 1,
      text: '1w'
    },
    {
      type: 'month',
      type_full: 'monthly',
      count: 1,
      text: '1m'
    },
    {
      type: 'year',
      type_full: 'yearly',
      count: 1,
      text: '1y'
    }
  ]

  const afterSetExtremes = (e: any) => {
    const { chart } = e.target

    chart.showLoading('Loading data from server...')

    setChartRef(chart)

    if (typeof e.rangeSelectorButton !== 'undefined' && e.rangeSelectorButton.type_full) {
      if (seriesContext !== e.rangeSelectorButton.type_full) {
        setSeriesContext(e.rangeSelectorButton.type_full)
        return
      }
    }
    chart.hideLoading()
  }

  useEffect(() => {
    if (graphData && !isEmpty(graphData) && graphData.length == tickers.length) {
      const ohlcSet: any = []
      const volumeSet: any = []
      graphData.forEach(function (singleGraphData: [number, { results: any }]) {
        // https://www.highcharts.com/demo/stock/candlestick-and-volume
        const ohlc: any = []
        ohlc.push([Date.UTC(new Date().getFullYear() - 2, 1, 1, 1, 1), null, null, null, null])
        const volume: any = []

        singleGraphData[1].results.forEach(function (e: any) {
          ohlc.push([
            e['timestamp'] * 1000, // the date
            e['open'], // open
            e['high'], // high
            e['low'], // low
            e['close'] // close
          ])
          volume.push([
            e['timestamp'] * 1000, // the date
            e['volume'] // volume
          ])
        })

        ohlcSet.push([singleGraphData[0], ohlc])
        volumeSet.push([singleGraphData[0], volume])
      })

      const tmpSeriesData: any = []

      ohlcSet.forEach(function (e: any) {
        tmpSeriesData.push({
          type: 'candlestick',
          data: e[1],
          id: `${e[0]}-price`,
          name: `${e[0]} Price`,
          dataGrouping: {
            enabled: false
          }
        })
      })
      volumeSet.forEach(function (e: any) {
        tmpSeriesData.push({
          type: 'column',
          id: `${e[0]}-volume`,
          name: `${e[0]} Volume`,
          data: e[1],
          yAxis: 1,
          dataGrouping: {
            enabled: true
          }
        })
      })

      const options = {
        // https://www.highcharts.com/docs/advanced-chart-features/boost-module
        boost: {
          useGPUTranslations: true,
          seriesThreshold: 1
        },
        title: {
          text: `Comparer`
        },
        yAxis: [
          {
            type: 'logarithmic',
            labels: {
              align: 'left'
            },
            height: '80%',
            resize: {
              enabled: true
            }
          },
          {
            labels: {
              align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
          }
        ],
        // https://www.highcharts.com/demo/stock/lazy-loading
        rangeSelector: {
          allButtonsEnabled: true,
          buttons: seriesIndex,
          inputEnabled: false,
          selected: seriesIndex.findIndex(function (seriesSelected: any) {
            return seriesSelected.type_full == seriesContext
          })
        },
        xAxis: {
          events: {
            afterSetExtremes: afterSetExtremes
          },
          minRange: 3600 * 1000 // one hour
        },
        tooltip: {
          shape: 'square',
          headerShape: 'callout',
          borderWidth: 0,
          valueDecimals: 2,
          shadow: false,
          positioner: function (
            width: number,
            height: number,
            point: Highcharts.TooltipPositionerPointObject
          ) {
            const chart = ((this as unknown) as ChartTooltip).chart
            if (point.isHeader) {
              return {
                x: Math.max(
                  // Left side limit
                  chart.plotLeft,
                  Math.min(
                    point.plotX + chart.plotLeft - width / 2,
                    // Right side limit
                    chart.chartWidth - width - chart.marginRight
                  )
                ),
                y: point.plotY
              }
            } else {
              return {
                x: point.series.chart.plotLeft,
                y: ((point.series.yAxis as unknown) as ChartTooltipTop).top - chart.plotTop
              }
            }
          }
        },
        series: tmpSeriesData
      }

      setGraphCard(
        <Card>
          <div style={{ height: '70vh', width: '100%' }}>
            <MainChart customType="stock" constructorType={'stockChart'} options={options} />
          </div>
        </Card>
      )
    }
  }, [graphData, tickers])

  const isLoggedIn = useIsLoggedIn()
  const routerObject = useHistory()
  const { accessToken, refreshToken, dispatch } = useStore()

  useEffect(() => {
    let newGraphData: any = []

    tickers.forEach(function (ticker_symbol: string) {
      const api_part = `/chart/${seriesContext}/${ticker_symbol}`

      const myFetch = async () => {
        try {
          const response = await fetch(`/api/v1${api_part}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
          if (!response.ok) {
            throw Error(`${response.status}`)
          }
          const data = await response.json()
          newGraphData = [...newGraphData, [ticker_symbol, data]]

          if (newGraphData.length == tickers.length) {
            setGraphData(newGraphData)
            if (chartRef) {
              chartRef.hideLoading()
            }
          }
        } catch (error) {
          message.error(error.message)
        }
      }
      myFetch()
    })
  }, [seriesContext, tickers])

  return (
    <Page>
      <Title>Compare Assets</Title>
      <Card title="Asset Selection">
        <Form name="normal_asset" className="report-form" onFinish={onFinish}>
          <Form.Item
            name="asset_id"
            label="Ticker (EXCHANGE:SYMBOL)"
            initialValue={[
              { key: 'NASDAQ:AAPL', value: 'NASDAQ:AAPL' },
              { key: 'NASDAQ:MSFT', value: 'NASDAQ:MSFT' }
            ]}
            rules={[
              {
                required: true,
                message: 'Please input two tickers!'
              },
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

      {graphCard}
    </Page>
  )
}

export default Compare
