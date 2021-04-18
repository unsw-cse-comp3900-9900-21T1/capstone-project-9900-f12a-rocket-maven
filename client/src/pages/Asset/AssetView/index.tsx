import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useFetchAssetData, useGetChartData } from '@rocketmaven/hooks/http'
import { useIsLoggedIn } from '@rocketmaven/hooks/store'
import { Row } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AssetGraphCard from './AssetGraphCard'
import { afterSetExtremesPrototype } from './AssetGraphCard/graphDefinitions'
import AssetOptions from './AssetOptions'
import AssetTableCard from './AssetTableCard'

type Params = {
  ticker_symbol: string
}

const AssetView = () => {
  const { ticker_symbol } = useParams<Params>()
  const { data: assetData } = useFetchAssetData(ticker_symbol)
  const [graphData, setGraphData] = useState<null | { results: any }>(null)
  const [chartRef, setChartRef] = useState<Highcharts.Chart>()
  const [seriesContext, setSeriesContext] = useState<string>('monthly')
  const getChartData = useGetChartData()
  const afterSetExtremes = afterSetExtremesPrototype(setChartRef, seriesContext, setSeriesContext)
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    const myFetch = async () => {
      const api_part = `/chart/${seriesContext}/${ticker_symbol}`
      const data = await getChartData({ apiPath: api_part })
      if (data) {
        setGraphData(data)
        if (chartRef) {
          chartRef.hideLoading()
        }
      }
    }
    myFetch()
  }, [seriesContext])

  return (
    <div>
      <Row>
        <Subtitle>{ticker_symbol} </Subtitle>
        {isLoggedIn ? (
          <AssetOptions
            tickerSymbol={ticker_symbol}
            currentPrice={assetData?.asset ? assetData?.asset.current_price : 0}
          />
        ) : null}
      </Row>
      <AssetTableCard data={assetData} />
      <AssetGraphCard
        graphData={graphData}
        tickerSymbol={ticker_symbol}
        afterSetExtremes={afterSetExtremes}
        seriesContext={seriesContext}
      />
    </div>
  )
}

export default AssetView
