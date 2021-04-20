import MainChart from '@rocketmaven/components/MainChart'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { isEmpty } from 'ramda'
import { createGraphOptions } from './graphDefinitions'
import { convertGraphDataToSeries } from './helper'

const AssetGraphCard = ({ graphData, tickerSymbol, afterSetExtremes, seriesContext }: any) => {
  if (!graphData || isEmpty(graphData)) {
    return null
  }
  const seriesData = convertGraphDataToSeries(graphData, tickerSymbol)
  const options = createGraphOptions({
    seriesContext,
    seriesData,
    afterSetExtremes,
    tickerSymbol
  })
  return (
    <Card>
      <div style={{ height: '70vh', width: '100%' }} className="asset-compare-chart">
        <MainChart customType="stock" constructorType={'stockChart'} options={options} />
      </div>
    </Card>
  )
}

export default AssetGraphCard
