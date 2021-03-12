import { Fragment  } from 'react'
import { useFetchGetWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
import DataVerticalDisplay from '../../../components/DataVerticalDisplay'
import { Col } from '../../../componentsStyled/Grid'
import { Flex } from '../../../componentsStyled/Flex'
import { Link } from 'react-router-dom';
import { urls } from '../../urls'

const AccountDetail = () => {
  
  // TODO(Jude): remove null after proper login/logout functionality is implemented
  // Shouldn't ever be null
  const accountData: Investor | null  = useFetchGetWithUserId('')
  const accountDataList = accountData && accountData.investor
  // TODO(Jude): replace with proper type
  const tempData = accountDataList && Object.entries(accountDataList)
  return (
    <Fragment>
      { tempData &&
        tempData.map(([key, value]:any, index:any) => 
          <Flex>
            <Col>
              {key}
            </Col>
            <Col>
              {value}
            </Col>
          </Flex>
        )
      }
      <Link to={urls.account + '/edit'}>
        Edit Account 
      </Link>
    </Fragment>
  )
}

export default AccountDetail