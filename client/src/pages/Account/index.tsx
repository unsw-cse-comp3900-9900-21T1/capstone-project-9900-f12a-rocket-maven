import Page from '@rocketmaven/pages/_Page'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import AccountDetail from '@rocketmaven/pages/Account/AccountDetail'
import { Switch, Route } from 'react-router-dom'
import { urls } from '@rocketmaven/data/urls'
import AccountPersonalInfoEdit from '@rocketmaven/pages/Account/AccountPersonalInfoEdit'
import AccountSecurityInfoEdit from '@rocketmaven/pages/Account/AccountSecurityInfoEdit'

const Account = () => {

  return (
    <Page>
      <Title>
        Account
      </Title>
      <Switch>
        <Route exact path={urls.account} component={AccountDetail} />
        <Route path={urls.account + '/personal'} component={AccountPersonalInfoEdit} />
        <Route path={urls.account + '/security'} component={AccountSecurityInfoEdit} />
      </Switch>
    </Page>
  )
}

export default Account
