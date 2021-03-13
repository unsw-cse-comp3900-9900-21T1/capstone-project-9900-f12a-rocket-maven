import { Switch, Route, Redirect } from 'react-router-dom'
import HomeStub from "../../pages/HomeStub"
import LogIn from "../../pages/LogIn"
import LogIn2 from "../../pages/LogIn2" // Tyson's LogIn page
import SignUp from "../../pages/SignUp"
import Portfolio from "../../pages/Portfolio"
import Account from '../../pages/Account'
import { urls } from '../../data/urls'

const Routes = () => (
  <Switch>
    {/* TODO(Jude): Distinguish between logged in and logged out routes */}
    {/* TODO(Jude): Make root path a redirect depending on logged in status*/}
    <Route exact path={urls.root} component={HomeStub} />
    <Route exact path={urls.login} component={LogIn} />
    <Route exact path={urls.login2} component={LogIn2} />
    <Route exact path={urls.signup} component={SignUp} />
    <Route path={urls.login} component={LogIn} />
    <Route path={urls.portfolio} component={Portfolio}/>
    <Route path={urls.account} component={Account}/>
  </Switch>
)

export default Routes
