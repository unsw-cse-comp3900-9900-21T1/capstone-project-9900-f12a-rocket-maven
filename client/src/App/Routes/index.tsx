import { url } from 'inspector'
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import HomeStub from "../../pages/HomeStub"
import LogIn from "../../pages/LogIn"
import PortDetails from "../../pages/PortDetails"
import { urls } from '../../pages/urls'

const Routes = () => (
  <Switch>
    {/* TODO(Jude): Distinguish between logged in and logged out routes */}
    {/* TODO(Jude): Make root path a redirect depending on logged in status*/}
    <Route exact path={urls.root} component={HomeStub} />
    <Route exact path={urls.login} component={LogIn} />
    <Route exact path={urls.portfolioDetails} component={PortDetails}/>
  </Switch>
)

export default Routes
