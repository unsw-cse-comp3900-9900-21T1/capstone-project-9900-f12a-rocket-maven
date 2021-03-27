import { Switch, Route, Redirect } from 'react-router-dom'
import { urls } from '../../data/urls'
import { useStore } from '../../hooks/store'
import LogIn from '../../pages/LogIn'
import Forgot from '../../pages/Forgot'
import SignUp from '../../pages/SignUp'
import Portfolio from '../../pages/Portfolio'
import Account from '../../pages/Account'
import HomeStub from '../../pages/HomeStub'
import PasswordReset from '../../pages/PasswordReset'
import Watchlists from '../../pages/Watchlists'
import Explore from '../../pages/Explore'

const Routes = () => {
  const { isLoggedIn } = useStore()
  return (
    <Switch>
      {/* TODO(Jude): Distinguish between logged in and logged out routes and prevent
      accessability */}
      <Route
        exact
        path={urls.root}
        render={() =>
          isLoggedIn ? <Redirect to={urls.portfolio} /> : <Redirect to={urls.explore} />
        }
      ></Route>
      <Route exact path={urls.explore} component={Explore}/>
      <Route exact path={urls.homeStub} component={HomeStub} />
      <Route exact path={urls.login} component={LogIn} />
      <Route exact path={urls.forgot} component={Forgot} />
      <Route exact path={urls.passwordReset} component={PasswordReset} />
      <Route exact path={urls.signup} component={SignUp} />
      <Route path={urls.login} component={LogIn} />
      <Route path={urls.portfolio} component={Portfolio} />
      <Route path={urls.account} component={Account} />
      <Route path={urls.watchlists} component={Watchlists} />
    </Switch>
  )
}

export default Routes
