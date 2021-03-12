import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import AccountDetail from './AccountDetail'
import AccountEdit from './AccountEdit'
import { Switch, Route } from 'react-router-dom'
import { urls } from '../../pages/urls'

const Account = () => {

  return (
    <Page>
      <Title>
        Account
      </Title>
      <Switch>
        <Route exact path={urls.account} component={AccountDetail} />
        <Route path={urls.account + '/edit'} component={AccountEdit} />
      </Switch>
    </Page>
  )
}

export default Account
