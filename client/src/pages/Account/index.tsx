import { Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import AccountDetail from '@rocketmaven/pages/Account/AccountDetail'
import AccountPersonalInfoEdit from '@rocketmaven/pages/Account/AccountPersonalInfoEdit'
import AccountSecurityInfoEdit from '@rocketmaven/pages/Account/AccountSecurityInfoEdit'
import Page from '@rocketmaven/pages/_Page'
import { Route, Switch } from 'react-router-dom'

const Account = () => {
  return (
    <Page>
      <Title>Account</Title>
      <Switch>
        <Route exact path={urls.account} component={AccountDetail} />
        <Route path={urls.account + '/personal'} component={AccountPersonalInfoEdit} />
        <Route path={urls.account + '/security'} component={AccountSecurityInfoEdit} />
      </Switch>
    </Page>
  )
}

export default Account
