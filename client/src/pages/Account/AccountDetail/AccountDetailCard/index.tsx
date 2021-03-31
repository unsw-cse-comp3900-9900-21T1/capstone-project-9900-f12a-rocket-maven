import { Fragment } from 'react'
import { Row, Col } from '@rocketmaven/componentsStyled/Grid'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Link } from 'react-router-dom'
import { urls } from '@rocketmaven/data/urls'
import { Investor } from '@rocketmaven/pages/Account/types'
import { Button, Divider, Descriptions } from 'antd'

const AccountDetailCard = ({ investor }: Investor) => {
  return (
    <Fragment>
      <Card style={{ width: '600px', marginTop: '30px', marginBottom: '30px' }}>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Username">{investor.username}</Descriptions.Item>

          <Descriptions.Item label="Email">{investor.email}</Descriptions.Item>

          <Descriptions.Item label="First Name">
            {investor.first_name ? investor.first_name : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Last Name">
            {investor.last_name ? investor.last_name : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Gender">
            {investor.gender ? investor.gender : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Country">
            {investor.country_of_residency ? investor.country_of_residency : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Date of Birth">
            {investor.date_of_birth ? investor.date_of_birth : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Join Date">
            {investor.join_date ? investor.join_date : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Profile Visibility">
            {investor.visibility ? 'Public' : 'Private'}
          </Descriptions.Item>
        </Descriptions>
        <Divider>Edit</Divider>
        <Button type="primary" style={{ marginRight: '8px', marginBottom: '12px' }}>
          <Link to={urls.account + '/personal'}>Edit Personal Details</Link>
        </Button>
        <Button type="primary" style={{ marginRight: '8px', marginBottom: '12px' }}>
          <Link to={urls.account + '/security'}>Edit Security</Link>
        </Button>
      </Card>
    </Fragment>
  )
}

export default AccountDetailCard
