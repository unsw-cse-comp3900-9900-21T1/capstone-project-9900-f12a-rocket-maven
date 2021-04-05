import React, { useEffect, useState } from 'react'
import { urls } from '@rocketmaven/data/urls'
import Page from '@rocketmaven/pages/_Page'
import { Link, Route, Switch } from 'react-router-dom'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Button } from '@rocketmaven/componentsStyled/Button'
import { Title } from '@rocketmaven/componentsStyled/Typography'

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
        <Button type="primary">
          <Link to="/report/builder?prefab=trades">Trades</Link>
        </Button>
        <br />
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
