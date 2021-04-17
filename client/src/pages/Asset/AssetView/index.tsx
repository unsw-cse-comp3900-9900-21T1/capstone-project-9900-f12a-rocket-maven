import MainChart from '@rocketmaven/components/MainChart'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { useFetchAPIPublicData, useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { useIsLoggedIn, useStore } from '@rocketmaven/hooks/store'
import { PortfolioPagination } from '@rocketmaven/pages/Portfolio/types'
import { Button, Col, Form, message, Popover, Row, Select, Statistic, Tooltip } from 'antd'
import { isEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { FaPlus, FaRegStar } from 'react-icons/fa'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
const { Option } = Select

type Params = {
  ticker_symbol: string
}
type ChartTooltip = {
  chart: any
}
type ChartTooltipTop = {
  top: any
}

const getColorOfValue = (value: number) => {
  return value < 0 ? 'red' : 'green'
}

type PortfolioListFetchResults = {
  data: PortfolioPagination
  isLoading: boolean
}

const AssetView = () => {
  const { ticker_symbol } = useParams<Params>()

  let asset_card = null
  let graph_card = null

  const { data } = useFetchAPIPublicData(ticker_symbol)

  const [graphData, setGraphData] = useState<null | { results: any }>(null)

  const [chartRef, setChartRef] = useState<Highcharts.Chart>()

  const [seriesData, setSeriesData] = useState<null | Array<Highcharts.SeriesOptionsType>>(null)

  const [seriesContext, setSeriesContext] = useState<string>('monthly')

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

  if (data && !isEmpty(data) && data.asset.asset_additional) {
    const asset_additional = JSON.parse(data.asset.asset_additional)
    console.log(asset_additional)

    let value = [['Current Market', false, data.asset.current_price]]

    let additional = [
      ['Change', true, asset_additional.regularMarketChange],
      ['Market Cap', false, asset_additional.marketCap],
      ['Volume', false, asset_additional.regularMarketVolume],
      ['PE', false, asset_additional.trailingPE],
      ['Yield', false, asset_additional.trailingAnnualDividendRate],
      ['EPS', false, asset_additional.epsTrailingTwelveMonths]
    ]
    additional.forEach(function (e: any[]) {
      if (e[2] && e[2].fmt) {
        value.push([e[0], e[1], e[2].fmt])
      }
    })

    asset_card = (
      <Card title={data.asset.name}>
        <Row gutter={16}>
          {value.map(function (e: any[]) {
            return (
              <Col span={6}>
                <Statistic
                  title={e[0]}
                  value={e[2]}
                  precision={2}
                  valueStyle={{
                    color: e[1] ? getColorOfValue(e[2]) : 'initial'
                  }}
                />
              </Col>
            )
          })}
        </Row>
      </Card>
    )
  }

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

  if (graphData && !isEmpty(graphData)) {
    // https://www.highcharts.com/demo/stock/candlestick-and-volume
    var ohlc: any = [[Date.UTC(2000, 1, 1, 1, 1), null, null, null, null]]
    var volume: any = []

    graphData.results.forEach(function (e: any) {
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

    let options = {
      title: {
        text: `${ticker_symbol} Tracker`
      },
      yAxis: [
        {
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
        buttons: seriesIndex,
        inputEnabled: false, // it supports only days
        selected: -1 /* seriesIndex.findIndex(function (seriesSelected: any) {
          return seriesSelected.type_full == seriesContext
        }) */ // all
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
      series: seriesData
    }

    graph_card = (
      <Card>
        <div style={{ height: '70vh', width: '100%' }}>
          <MainChart customType="stock" constructorType={'stockChart'} options={options} />
        </div>
      </Card>
    )
  }

  const isLoggedIn = useIsLoggedIn()
  const routerObject = useHistory()
  const { accessToken, refreshToken, dispatch } = useStore()

  const addToWatchlist = async () => {
    if (isLoggedIn) {
      const response = await fetch(`/api/v1/watchlist/${ticker_symbol}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw Error(`${data.msg}`)
      }
      routerObject.push(urls.watchlists)
    }
  }

  const [children, setChildren] = useState([])

  const [refreshFlag, setRefreshFlag] = useState(0)

  const { data: fetchPortfolioData }: PortfolioListFetchResults = useFetchGetWithUserId(
    '/all_portfolios',
    refreshFlag
  )

  const addToPortfolio = (e: any) => {
    console.log(e, ticker_symbol)

    // https://stackoverflow.com/questions/59464337/how-to-send-params-in-usehistory-of-react-router-dom
    routerObject.push({
      pathname: `${urls.portfolio}/${e.portfolio}/addremove`,
      search: `?stock_ticker=${ticker_symbol}&current_price=${data?.asset.current_price}&holdings=1000000`,
      state: {
        // location state
        update: true
      }
    })
  }

  useEffect(() => {
    if (fetchPortfolioData && !isEmpty(fetchPortfolioData)) {
      const tmpChildren: any = []
      const tmpChildren2: any = fetchPortfolioData.results.map(function (e) {
        tmpChildren.push(e.id)
        return (
          <Option key={e.id} value={e.id}>
            #{e.id} - {e.name}
          </Option>
        )
      })
      setChildren(tmpChildren2)
    }
  }, [fetchPortfolioData])

  useEffect(() => {
    const api_part = `/chart/${seriesContext}/${ticker_symbol}`

    const myFetch = async () => {
      try {
        const response = await fetch(`/api/v1${api_part}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        console.log('*********************** status is', response.status)
        if (!response.ok) {
          throw Error(`${response.status}`)
        }
        const data = await response.json()
        setGraphData(data)
        if (chartRef) {
          chartRef.hideLoading()
        }
      } catch (error) {
        message.error(error.message)
      }
    }
    myFetch()
  }, [seriesContext])

  useEffect(() => {
    if (graphData && !isEmpty(graphData)) {
      setSeriesData([
        {
          type: 'candlestick',
          data: ohlc,
          name: `${ticker_symbol} Price`,
          dataGrouping: {
            enabled: false
          }
        },
        {
          type: 'column',
          id: 'aapl-volume',
          name: `${ticker_symbol} Volume`,
          data: volume,
          yAxis: 1,
          dataGrouping: {
            enabled: false
          }
        }
      ])
    }
  }, [graphData])
  return (
    <div>
      <Subtitle>
        {ticker_symbol}{' '}
        {isLoggedIn ? (
          <>
            <Tooltip placement="topLeft" title="Add to Watchlist" arrowPointAtCenter>
              <Button onClick={addToWatchlist} style={{ marginLeft: '0.5rem' }}>
                <FaRegStar />
              </Button>
            </Tooltip>

            <Popover
              title="Add to Portfolio"
              trigger="click"
              placement="bottom"
              content={
                <Form onFinish={addToPortfolio}>
                  <Form.Item label="Portfolio" name="portfolio" rules={[{ required: true }]}>
                    <Select placeholder="Please select" style={{ width: '100%' }}>
                      {children}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: '0.5rem',
                        marginRight: '0.5rem'
                      }}
                      htmlType="submit"
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Form>
              }
            >
              <Tooltip placement="topLeft" title="Add to Portfolio" arrowPointAtCenter>
                <Button style={{ marginLeft: '0.5rem' }}>
                  <FaPlus />
                </Button>
              </Tooltip>
            </Popover>
          </>
        ) : null}
      </Subtitle>
      {asset_card}
      {graph_card}
    </div>
  )
}

export default AssetView
