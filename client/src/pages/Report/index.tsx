import { Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import ReportGenerate from '@rocketmaven/pages/Report/ReportGenerate'
import ReportLanding from '@rocketmaven/pages/Report/ReportLanding'
import Page from '@rocketmaven/pages/_Page'
import { Route, Switch } from 'react-router-dom'

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
