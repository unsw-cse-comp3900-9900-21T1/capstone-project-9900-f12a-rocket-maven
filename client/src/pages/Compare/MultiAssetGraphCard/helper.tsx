
export const convertGraphDataToSeries = (graphData: any) => {
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
  return tmpSeriesData
}