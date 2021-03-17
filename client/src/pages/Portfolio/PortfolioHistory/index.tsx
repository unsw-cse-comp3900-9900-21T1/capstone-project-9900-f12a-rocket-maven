
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
        name: "Add?",
        dataIndex: "add_action"
      },
      {
        name: "Event ID",
        dataIndex: "id"
      },
      {
        name: "Ticker",
        dataIndex: "asset_id"
      },
      {
        name: "Date",
        dataIndex: "event_date"
      },
      {
        name: "Fees",
        dataIndex: "fees"
      },
      {
        name: "Units",
        dataIndex: "units"
      },
      {
        name: "Price Per Share",
        dataIndex: "price_per_share"
      },
      {
        name: "Note",
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
      <Link to={urls.portfolio + `/${id}/history/asset-create`}>
        Add Asset
      </Link>
      {historyTable}
    </Fragment>
    :
      null
  )
}

export default PortfolioHistory