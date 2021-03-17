
import { Fragment } from 'react'
import { isEmpty } from  'ramda'
import { Subtitle } from '../../../componentsStyled/Typography'
import { useParams, Link } from 'react-router-dom'
import { useGetPortfolioHistory } from '../../../hooks/http'
import { PortfolioEvent, PortfolioEventPagination } from './types'
import { urls } from '../../../data/urls'
import { Table } from 'antd';

type Params = {
  id: string
}

const PortfolioHistory = () => {
  const { id } = useParams<Params>()

  // Avoid call when isCreate is true
  // Might have to just make a PortfolioCreate component 
  const portfolioHistory: PortfolioEventPagination = useGetPortfolioHistory(id);
  var historyTable = null;
  if (!portfolioHistory || isEmpty(portfolioHistory)) {
  } else {
        const histories:[PortfolioEvent] = portfolioHistory.results;

    const columns = [
      {
        title: "Type",
        dataIndex: "add_action",
        render:  (value: string) => (
            value?"Add":"Remove"
        ),
      },
      {
        title: "Event ID",
        dataIndex: "id"
      },
      {
        title: "Ticker",
        dataIndex: "asset_id"
      },
      {
        title: "Date",
        dataIndex: "event_date"
      },
      {
        title: "Fees",
        dataIndex: "fees"
      },
      {
        title: "Units",
        dataIndex: "units"
      },
      {
        title: "Price Per Share",
        dataIndex: "price_per_share"
      },
      {
        title: "Note",
        dataIndex: "note"
      }
    ];
      historyTable = <Table columns={columns} dataSource={histories} rowKey="id"  />;
      
  
  }

  // TODO(Jude)
  return (
    !isEmpty(portfolioHistory) ?
    <Fragment>
      <Subtitle>
        Portfolio History
      </Subtitle>
      {historyTable}
    </Fragment>
    :
      null
  )
}

export default PortfolioHistory