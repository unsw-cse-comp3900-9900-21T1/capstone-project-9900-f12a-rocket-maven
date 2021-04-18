import { Button, Popover } from 'antd'
import { Link } from 'react-router-dom'
import NotifyContent from './NotifyContent'

export const createWatchListColumns = (
  deleteWatchListItem: any,
  refreshAfterNotificationSet: number,
  setRefreshAfterNotificationSet: React.Dispatch<React.SetStateAction<number>>
) => {
  return [
    {
      title: 'Ticker',
      dataIndex: 'ticker_symbol',
      render: (value: string) => (
        <Link
          to={`/asset/${value}`}
          style={{
            marginRight: '8px',
            marginBottom: '12px'
          }}
        >
          {value}
        </Link>
      )
    },
    {
      title: 'Name',
      dataIndex: 'asset_additional',
      render: (value: string) => {
        const asset_additional = JSON.parse(value)
        const focus = asset_additional.longName
        if (focus) {
          return <div>{focus}</div>
        }
        return null
      }
    },
    {
      title: 'Price',
      dataIndex: 'current_price'
    },
    {
      title: 'Change',
      dataIndex: 'asset_additional',
      render: (value: string) => {
        const asset_additional = JSON.parse(value)
        const focus = asset_additional.regularMarketChange
        if (focus) {
          return <div>{focus.fmt}</div>
        }
        return null
      }
    },
    {
      title: 'Market Cap',
      dataIndex: 'asset_additional',
      render: (value: string) => {
        const asset_additional = JSON.parse(value)
        const focus = asset_additional.marketCap
        if (focus) {
          return <div>{focus.fmt}</div>
        }
        return null
      }
    },
    {
      title: '52-Week High',
      dataIndex: 'asset_additional',
      render: (value: string) => {
        const asset_additional = JSON.parse(value)
        const focus = asset_additional.fiftyTwoWeekHigh
        if (focus) {
          return <div>{focus.fmt}</div>
        }
        return null
      }
    },
    {
      title: '52-Week Low',
      dataIndex: 'asset_additional',
      render: (value: string) => {
        const asset_additional = JSON.parse(value)
        const focus = asset_additional.fiftyTwoWeekLow
        if (focus) {
          return <div>{focus.fmt}</div>
        }
        return null
      }
    },
    {
      title: 'Notify Low / High',
      dataIndex: 'price_high_low',
      render: (value: [number, number], record: any) => {
        return (
          <>
            Above High:{' '}
            <Popover
              content={NotifyContent(
                record.ticker_symbol,
                'high',
                value[0],
                record.current_price,
                refreshAfterNotificationSet,
                setRefreshAfterNotificationSet
              )}
              title="Set High"
              placement="bottom"
              trigger="hover"
            >
              <Popover
                content={NotifyContent(
                  record.ticker_symbol,
                  'high',
                  value[0],
                  record.current_price,
                  refreshAfterNotificationSet,
                  setRefreshAfterNotificationSet
                )}
                title="Set High"
                placement="bottom"
                trigger="click"
              >
                <Button type="link">{value[0] ? value[0] : 'Change me!'}</Button>
              </Popover>
            </Popover>
            <br />
            Below Low:{' '}
            <Popover
              content={NotifyContent(
                record.ticker_symbol,
                'low',
                value[1],
                record.current_price,
                refreshAfterNotificationSet,
                setRefreshAfterNotificationSet
              )}
              title="Set Low"
              placement="bottom"
              trigger="hover"
            >
              <Popover
                content={NotifyContent(
                  record.ticker_symbol,
                  'low',
                  value[1],
                  record.current_price,
                  refreshAfterNotificationSet,
                  setRefreshAfterNotificationSet
                )}
                title="Set Low"
                placement="bottom"
                trigger="click"
              >
                <Button type="link">{value[1] ? value[1] : 'Change me!'}</Button>
              </Popover>
            </Popover>
          </>
        )
      }
    },
    {
      title: 'Delete',
      dataIndex: 'ticker_symbol',
      key: 'x',
      render: (value: string) => (
        <a title={value} onClick={deleteWatchListItem}>
          Delete
        </a>
      )
    }
  ]
}
