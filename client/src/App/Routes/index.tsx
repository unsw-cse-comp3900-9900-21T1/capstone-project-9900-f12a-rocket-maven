import { urls } from '@rocketmaven/data/urls'
import { useStore } from '@rocketmaven/hooks/store'
import Account from '@rocketmaven/pages/Account'
import AdvancedSearch from '@rocketmaven/pages/AdvancedSearch'
import Asset from '@rocketmaven/pages/Asset'
import Compare from '@rocketmaven/pages/Compare'
import Explore from '@rocketmaven/pages/Explore'
import Forgot from '@rocketmaven/pages/Forgot'
import HomeStub from '@rocketmaven/pages/HomeStub'
import Leaderboard from '@rocketmaven/pages/Leaderboard'
import LogIn from '@rocketmaven/pages/LogIn'
import PasswordReset from '@rocketmaven/pages/PasswordReset'
import Portfolio from '@rocketmaven/pages/Portfolio'
import Report from '@rocketmaven/pages/Report'
import SignUp from '@rocketmaven/pages/SignUp'
import TopAdditions from '@rocketmaven/pages/TopAdditions'
import Watchlists from '@rocketmaven/pages/Watchlists'
import { Redirect, Route, Switch } from 'react-router-dom'


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
      <Route exact path={urls.compare} component={Compare} />
      <Route exact path={urls.homeStub} component={HomeStub} />
      <Route exact path={urls.login} component={LogIn} />
      <Route exact path={urls.forgot} component={Forgot} />
      <Route exact path={urls.passwordReset} component={PasswordReset} />
      <Route exact path={urls.signup} component={SignUp} />
      <Route exact path={urls.advancedSearch} component={AdvancedSearch} />
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
