import { Form, Input } from 'antd'

// https://www.npmjs.com/package/highcharts-react-official
import 'highcharts/css/stocktools/gui.css'
import 'highcharts/css/annotations/popup.css'

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import exporting from 'highcharts/modules/exporting'
import offlineExporting from 'highcharts/modules/offline-exporting'
import exportData from 'highcharts/modules/export-data'
import indicatorsAll from 'highcharts/indicators/indicators-all'
import dragPanes from 'highcharts/modules/drag-panes'
import annotationsAdvanced from 'highcharts/modules/annotations-advanced'
import priceIndicator from 'highcharts/modules/price-indicator'
import fullScreen from 'highcharts/modules/full-screen'
import stockTools from 'highcharts/modules/stock-tools'
import drilldown from 'highcharts/modules/drilldown'
import accessibility from 'highcharts/modules/accessibility'

import '@rocketmaven/components/MainChart/AdditionalChart.css'

exporting(Highcharts)
offlineExporting(Highcharts)
exportData(Highcharts)
accessibility(Highcharts)

const MainChart = (props: any) => {
  props.options.navigation = {
    iconsURL: process.env.PUBLIC_URL + '/third-party/highcharts/gfx/stock-icons/'
  }

  if ('customType' in props && props.customType == 'stock') {
    indicatorsAll(Highcharts)
    dragPanes(Highcharts)
    annotationsAdvanced(Highcharts)
    priceIndicator(Highcharts)
    fullScreen(Highcharts)
    stockTools(Highcharts)
  }
  if ('customType' in props && props.customType == 'pie') {
    drilldown(Highcharts)
  }

  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{ style: { width: '100%', height: '70vh' } }}
        {...props}
      />
    </div>
  )
}

export default MainChart
