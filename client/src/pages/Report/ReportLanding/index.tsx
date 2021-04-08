import { Button } from '@rocketmaven/componentsStyled/Button'
import { Card } from '@rocketmaven/componentsStyled/Card'
import React from 'react'
import { Link } from 'react-router-dom'

const ReportLanding = () => {
  return (
    <div>
      <Card title="Quick Reports">
        <Button type="primary">
          <Link to="/report/builder?prefab=all-time">All-Time Portfolio Comparison</Link>
        </Button>
        <br />
        <Button type="primary">
          <Link to="/report/builder?prefab=year">Year Portfolio Comparison</Link>
        </Button>
        <br />
        <Button type="primary">
          <Link to="/report/builder?prefab=monthly">Month Portfolio Comparison</Link>
        </Button>
        <br />
        {/* <Button type="primary">
          <Link to="/report/builder?prefab=trades">Trades</Link>
        </Button>
        <br /> */}
        <Button type="primary">
          <Link to="/report/builder?prefab=diversification">Diversification</Link>
        </Button>
        <br />
        <Button type="primary">
          <Link to="/report/builder?prefab=tax">Tax Report</Link>
        </Button>
      </Card>
      <Card title="Custom Reports">
        <Button type="primary">
          <Link to="/report/builder">Report Builder</Link>
        </Button>
      </Card>
    </div>
  )
}

export default ReportLanding
