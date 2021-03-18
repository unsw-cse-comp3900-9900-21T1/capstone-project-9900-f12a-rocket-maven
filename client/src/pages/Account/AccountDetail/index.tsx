import { Fragment  } from 'react'
import { useFetchGetWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
import DataVerticalDisplay from '../../../components/DataVerticalDisplay'
import { Col } from '../../../componentsStyled/Grid'
import { Flex } from '../../../componentsStyled/Flex'
import { Link } from 'react-router-dom';
import { urls } from '../../../data/urls'
import { Button } from 'antd';
import { MyCard } from '../../../componentsStyled/Card';

const AccountDetail = () => {
  
  // TODO(Jude): remove null after proper login/logout functionality is implemented
  // Shouldn't ever be null
  const accountData: Investor | null  = useFetchGetWithUserId('')
  const accountDataList = accountData && accountData.investor
  // TODO(Jude): replace with proper type
  const tempData = accountDataList && Object.entries(accountDataList)
  return (
    <Fragment>
      <MyCard>
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
      </MyCard>
      <Button type="primary" style={{marginRight: "8px",  marginBottom: "12px"}}>
      <Link to={urls.account + '/personal'}>
        Edit Personal Details 
      </Link>
      </Button>
      <Button type="primary" style={{marginRight: "8px",  marginBottom: "12px"}}>
      <Link to={urls.account + '/security'}>
        Edit Security 
      </Link>
      </Button>
      
    </Fragment>
  )
}

export default AccountDetail