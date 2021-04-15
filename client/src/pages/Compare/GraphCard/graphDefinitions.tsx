
type ChartTooltip = {
  chart: any
}
type ChartTooltipTop = {
  top: any
}

export const seriesIndex = [
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

export const afterSetExtremesPrototype = (
  setChartRef: any,
  seriesContext: any,
  setSeriesContext: any
) => (e: any) => {
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

export const createGraphOptions = ({
  seriesContext,
  tmpSeriesData,
  afterSetExtremes,
}: any) => {
  return {
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

}