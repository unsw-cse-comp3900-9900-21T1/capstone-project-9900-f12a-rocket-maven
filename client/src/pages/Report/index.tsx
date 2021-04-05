import React, { useEffect, useState } from 'react'
import { urls } from '@rocketmaven/data/urls'
import Page from '@rocketmaven/pages/_Page'
import { Link, Route, Switch } from 'react-router-dom'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Button } from '@rocketmaven/componentsStyled/Button'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import ReportLanding from '@rocketmaven/pages/Report/ReportLanding'
import ReportGenerate from '@rocketmaven/pages/Report/ReportGenerate'

const Report = () => {
  return (
    <Page>
      <Title>Report</Title>
      <Switch>
        <Route exact path={urls.report} component={ReportLanding} />
        <Route path={urls.report + '/builder'} component={ReportGenerate} />
      </Switch>
    </Page>
  )
}

export default Report
