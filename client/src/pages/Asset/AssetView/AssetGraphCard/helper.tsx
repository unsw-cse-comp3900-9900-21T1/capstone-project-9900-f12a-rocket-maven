export const convertGraphDataToSeries = (graphData: any, ticker_symbol: string) => {
  const ohlc: any = []
  ohlc.push([Date.UTC(new Date().getFullYear() - 2, 1, 1, 1, 1), null, null, null, null])
  const volume: any = []

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

  const seriesData: any = [
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
  ]

  return seriesData
}
