import Page from '@rocketmaven/pages/_Page'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import AccountDetail from './AccountDetail'
import { Switch, Route } from 'react-router-dom'
import { urls } from '@rocketmaven/data/urls'
import AccountPersonalInfoEdit from './AccountPersonalInfoEdit'
import AccountSecurityInfoEdit from './AccountSecurityInfoEdit'

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
