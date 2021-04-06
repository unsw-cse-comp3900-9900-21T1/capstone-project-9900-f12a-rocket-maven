import { Switch, Route, Redirect } from 'react-router-dom'
import { urls } from '@rocketmaven/data/urls'
import { useStore } from '@rocketmaven/hooks/store'
import LogIn from '@rocketmaven/pages/LogIn'
import Forgot from '@rocketmaven/pages/Forgot'
import SignUp from '@rocketmaven/pages/SignUp'
import Portfolio from '@rocketmaven/pages/Portfolio'
import Account from '@rocketmaven/pages/Account'
import HomeStub from '@rocketmaven/pages/HomeStub'
import PasswordReset from '@rocketmaven/pages/PasswordReset'
import Asset from '@rocketmaven/pages/Asset'
import Watchlists from '@rocketmaven/pages/Watchlists'
import Explore from '@rocketmaven/pages/Explore'
import Leaderboard from '@rocketmaven/pages/Leaderboard'
import Report from '@rocketmaven/pages/Report'
import TopAdditions from '@rocketmaven/pages/TopAdditions'

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
      <Route exact path={urls.explore} component={Explore} />
      <Route exact path={urls.leaderboard} component={Leaderboard} />
      <Route exact path={urls.homeStub} component={HomeStub} />
      <Route exact path={urls.login} component={LogIn} />
      <Route exact path={urls.forgot} component={Forgot} />
      <Route exact path={urls.passwordReset} component={PasswordReset} />
      <Route exact path={urls.signup} component={SignUp} />
      <Route path={urls.login} component={LogIn} />
      <Route path={urls.portfolio} component={Portfolio} />
      <Route path={urls.asset} component={Asset} />
      <Route path={urls.account} component={Account} />
      <Route path={urls.watchlists} component={Watchlists} />
      <Route path={urls.report} component={Report} />
      <Route path={urls.topAdditions} component={TopAdditions} />
    </Switch>
  )
}

export default Routes
