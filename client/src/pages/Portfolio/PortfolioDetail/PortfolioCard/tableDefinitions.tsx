
const numberChangeRenderer = (testVal: string, record: any) => {
  const text = parseFloat(testVal).toFixed(2)
  return {
    props: {
      style: { color: parseFloat(testVal) < 0 ? 'red' : 'green' }
    },
    children: <span>{text}</span>
  }
}

export const columns = [
  { title: 'Ticker Symbol', dataIndex: 'asset_id' },
  {
    title: 'Available Units',
    dataIndex: 'available_units',
    render: (value: number) => value.toFixed(2)
  },
  {
    title: 'Avg. Purchase Price',
    dataIndex: 'average_price',
    render: (value: number) => value.toFixed(2)
  },
  {
    title: 'Current Market Price',
    dataIndex: 'market_price',
    render: (value: number) => value.toFixed(2)
  },
  {
    title: 'Current Value',
    dataIndex: 'current_value',
    render: (value: number) => value.toFixed(2)
  },
  {
    title: 'Realised Total',
    dataIndex: 'realised_total',
    render: (value: number) => value.toFixed(2)
  },
  {
    title: 'Purchase Value',
    dataIndex: 'purchase_value',
    render: (value: number) => value.toFixed(2)
  },
  {
    title: 'Unrealised Profit/Loss',
    dataIndex: 'unrealised_units',
    render: numberChangeRenderer
  },
  { title: 'Last Updated', dataIndex: 'last_updated' },
  { title: 'Latest Note', dataIndex: 'latest_note' } /* https://ant.design/components/table/ */
]

export const valueColumns = [
  { title: 'Purchase Cost', dataIndex: 'Purchase Cost' },
  { title: 'Current Market', dataIndex: 'Current Market' },
  {
    title: 'Unrealised (Market - Purchase)',
    dataIndex: 'Unrealised',
    render: numberChangeRenderer
  },
  {
    title: 'Realised (Sold Value)',
    dataIndex: 'Realised (Sold Value)',
    render: numberChangeRenderer
  }
]