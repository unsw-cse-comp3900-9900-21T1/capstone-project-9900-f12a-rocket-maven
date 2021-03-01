import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import HomeStub from "../../pages/HomeStub"
import LogIn from "../../pages/LogIn"

const Routes = () => (
  <Switch>
    {/* TODO(Jude): Distinguish between logged in and logged out routes */}
    {/* TODO(Jude): Make root path a redirect depending on logged in status*/}
    <Route exact path="/" component={HomeStub} />
    <Route exact path="/login-stub" component={LogIn} />
  </Switch>
)

export default Routes
