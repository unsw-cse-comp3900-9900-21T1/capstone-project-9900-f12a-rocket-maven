import { Fragment  } from 'react'
import { Row, Col } from '../../../../componentsStyled/Grid'
import { Card } from '../../../../componentsStyled/Card'
import { Link } from 'react-router-dom';
import { urls } from '../../../../data/urls'
import { Investor } from '../../types'
import { Button, Divider } from 'antd';


const AccountDetailCard = ({investor}: Investor) => {
  return (
    <Fragment>
      <Card style={{width:"600px", marginTop: "30px",  marginBottom: "30px"}}>
        <Row>
          <Col>
            Username
          </Col>
          <Col>
            {investor.username}
          </Col>
        </Row>
        <Row>
          <Col>
            Email
          </Col>
          <Col>
            {investor.email}
          </Col>
        </Row>
        <Row>
          <Col>
            First Name
          </Col>
          <Col>
            {investor.first_name ? investor.first_name : ''}
          </Col>
        </Row>
        <Row>
          <Col>
            Last Name
          </Col>
          <Col>
            {investor.last_name ? investor.last_name : ''}
          </Col>
        </Row>
        <Row>
          <Col>
            Gender
          </Col>
          <Col>
            {investor.gender ? investor.gender: ''}
          </Col>
        </Row>
        <Row>
          <Col>
            Country
          </Col>
          <Col>
            {investor.country_of_residency ? investor.country_of_residency: ''}
          </Col>
        </Row>
        <Row>
          <Col>
            Date of Birth
          </Col>
          <Col>
            {investor.date_of_birth ? investor.date_of_birth: ''}
          </Col>
        </Row>
        <Row>
          <Col>
            Join Date
          </Col>
          <Col>
            {investor.join_date ? investor.join_date: ''}
          </Col>
        </Row>
        <Row>
          <Col>
            Profile Visibility
          </Col>
          <Col>
            {investor.visibility ? 'Public' : 'Private'}
          </Col>
        </Row>
        <Divider>Edit</Divider>
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
      </Card>
    </Fragment>
  )
}

export default AccountDetailCard