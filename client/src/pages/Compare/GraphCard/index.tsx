import MainChart from '@rocketmaven/components/MainChart'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { isEmpty } from 'ramda'
import { createGraphOptions } from './graphDefinitions'
import { convertGraphDataToSeries } from './helper'

const GraphCard = ({
  graphData,
  tickers,
  afterSetExtremes,
  seriesContext,
}: any) => {
  if (!graphData || isEmpty(graphData) || graphData.length !== tickers.length) {
    return null
  }
  const tmpSeriesData = convertGraphDataToSeries(graphData)
  const options = createGraphOptions({
    seriesContext,
    tmpSeriesData,
    afterSetExtremes,
  })

  return (
    <Card>
      <div style={{ height: '70vh', width: '100%' }}>
        <MainChart customType="stock" constructorType={'stockChart'} options={options} />
      </div>
    </Card>
  )
}

export default GraphCard
