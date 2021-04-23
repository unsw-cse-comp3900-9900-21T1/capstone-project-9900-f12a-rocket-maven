import { QuestionCircleOutlined } from '@ant-design/icons'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import {
  useDeleteAssetPortfolioHistory,
  useGetPortfolioHistory,
  useUpdateAssetPortfolioHistory
} from '@rocketmaven/hooks/http'
import { PortfolioEvent } from '@rocketmaven/pages/Portfolio/types'
import { Button, DatePicker, Form, Input, InputNumber, Popconfirm, Table, Tooltip } from 'antd'
import moment from 'moment'
import { isEmpty } from 'ramda'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type Params = {
  id: string
}

// https://ant.design/components/table/#components-table-demo-edit-cell
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text' | 'date' | 'fees'
  record: PortfolioEvent
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <InputNumber min="0.0001" />
    ) : inputType === 'date' ? (
      <DatePicker />
    ) : inputType === 'fees' ? (
      <InputNumber min="0" />
    ) : (
      <Input />
    )

  const requiredField = inputType === 'text' ? false : true

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className="editable-no-margin"
          rules={[
            {
              required: requiredField,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const PortfolioHistory = () => {
  const { id } = useParams<Params>()

  const [form] = Form.useForm()
  const [editData, setEditData] = useState<[PortfolioEvent]>()
  const [editingKey, setEditingKey] = useState(-1)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const refreshPortfolios = () => setRefreshFlag(refreshFlag + 1)

  const isEditing = (record: PortfolioEvent) => record.id === editingKey

  const edit = (record: Partial<PortfolioEvent> & { id: number }) => {
    form.setFieldsValue({
      ...record
    })
    setEditingKey(record.id)
  }

  const cancel = () => {
    setEditingKey(-1)
  }

  const updateAssetPortfolioHistoryFetch = useUpdateAssetPortfolioHistory()
  const deleteAssetPortfolioHistoryFetch = useDeleteAssetPortfolioHistory()

  const save = async (portfolioID: string | undefined, id: number) => {
    try {
      const row = (await form.validateFields()) as PortfolioEvent

      const path = `${portfolioID}/history`

      const values = { id: id, ...form.getFieldsValue() }
      await updateAssetPortfolioHistoryFetch({
        apiPath: path,
        values: values
      })

      setEditingKey(-1)
      refreshPortfolios()
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const deleteHistory = async (portfolioID: string | undefined, id: number) => {
    try {
      const row = (await form.validateFields()) as PortfolioEvent

      const path = `${portfolioID}/history`
      const values = { id: id }
      await deleteAssetPortfolioHistoryFetch({
        apiPath: path,
        values: values
      })

      setEditingKey(-1)
      refreshPortfolios()
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const { isLoading, data } = useGetPortfolioHistory(id, refreshFlag)

  let historyTable = null
  if (data && !isEmpty(data)) {
    const histories: [PortfolioEvent] = data.results

    let editable = false
    if (data.results.length > 0) {
      if (!data.results[0].competition_portfolio) {
        editable = true
      }
    }

    const columns = [
      {
        title: 'Type',
        dataIndex: 'add_action',
        render: (value: string) =>
          value ? (
            <Tooltip title="Added">
              <span style={{ fontSize: '1.5rem', color: 'green' }}>+</span>
            </Tooltip>
          ) : (
            <Tooltip title="Removed">
              <span style={{ fontSize: '2rem', color: 'red' }}>-</span>
            </Tooltip>
          )
      },
      {
        title: 'Event ID',
        dataIndex: 'id'
      },
      {
        title: 'Ticker',
        dataIndex: 'asset_id',
        render: (value: string) => (
          <span>
            <Tooltip
              placement="topLeft"
              title={`View ${value} details and graph`}
              arrowPointAtCenter
            >
              <Link
                to={`/asset/${value}`}
                style={{
                  marginRight: '8px',
                  marginBottom: '12px'
                }}
              >
                {value}
              </Link>
            </Tooltip>

            <Tooltip
              placement="topLeft"
              title={`Filter holding history by ${value}`}
              arrowPointAtCenter
            >
              <Button
                type="primary"
                style={{
                  float: 'right'
                }}
              >
                <Link to={`/portfolio/${id}/holdings/${value}`}>Filter</Link>
              </Button>
            </Tooltip>
          </span>
        )
      },
      {
        title: 'Date',
        dataIndex: 'event_date',
        render: (value: string) => {
          const newMoment = moment.utc(value)
          if (newMoment) {
            return newMoment.local().format('YYYY-MM-DD')
          } else {
            return value
          }
        },
        editable: false
      },
      {
        title: 'Available',
        dataIndex: 'dynamic_after_FIFO_units',
        render: (value: number, record: any) => {
          if (record.add_action) {
            return value.toFixed(2)
          } else {
            return null
          }
        }
      },
      {
        title: 'Fees',
        dataIndex: 'fees',
        editable: true
      },
      {
        title: 'Units',
        dataIndex: 'units',
        editable: true
      },
      {
        title: 'Currency',
        dataIndex: 'asset_currency',
        editable: false
      },
      {
        title: 'Price Per Unit',
        dataIndex: 'price_per_share',
        render: (value: number) => value.toFixed(2),
        editable: true
      },
      {
        title: 'Exchange Rate',
        dataIndex: 'exchange_rate',
        render: (value: number) => value.toFixed(2),
        editable: true
      },
      {
        title: 'Note',
        dataIndex: 'note',
        editable: true
      },
      ...(editable
        ? [
            {
              title: 'Action',
              dataIndex: 'id',
              render: (_: any, record: PortfolioEvent) => {
                const editing = isEditing(record)
                return (
                  <>
                    {editing ? (
                      <>
                        <Button
                          onClick={async () => {
                            save(record.portfolio_id, record.id)
                          }}
                          style={{ marginRight: 8 }}
                          type="primary"
                        >
                          Save
                        </Button>
                        <Button type="primary" onClick={cancel}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="primary"
                          disabled={editingKey !== -1}
                          onClick={() => edit(record)}
                        >
                          Edit
                        </Button>
                        {'    '}
                        <Popconfirm
                          title="Sure to delete this event?"
                          onConfirm={() => {
                            deleteHistory(record.portfolio_id, record.id)
                          }}
                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                          <Button type="primary" danger disabled={editingKey !== -1}>
                            Delete
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                  </>
                )
              }
            }
          ]
        : [])
    ]

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col
      }

      let inputType = 'text'
      switch (col.dataIndex) {
        case 'event_date': {
          inputType = 'date'
          break
        }
        case 'units':
        case 'exchange_rate':
        case 'price_per_share': {
          inputType = 'number'
          break
        }
        case 'fees': {
          inputType = 'fees'
          break
        }
        case 'note':
        default: {
          inputType = 'text'
        }
      }

      return {
        ...col,
        onCell: (record: PortfolioEvent) => ({
          record,
          inputType: inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        })
      }
    })

    historyTable = (
      <Form form={form} component={false}>
        <Table
          key={`historyTableNo${refreshFlag}`}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          columns={mergedColumns}
          dataSource={histories}
          rowKey="id"
          pagination={false}
          rowClassName="editable-row"
        />
      </Form>
    )
  }

  return isLoading ? null : (
    <Fragment>
      <Subtitle>Portfolio History</Subtitle>
      {historyTable}
    </Fragment>
  )
}

export default PortfolioHistory
