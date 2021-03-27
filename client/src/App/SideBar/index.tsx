import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaUserPlus } from 'react-icons/fa'
// import { SidebarWrap } from "./styled"
import { urls } from '../../data/urls'
import { Subtitle } from '../../componentsStyled/Typography'
import { useStore } from '../../hooks/store'

import { Layout, Menu, Breadcrumb } from 'antd'
const { SubMenu } = Menu
const { Header, Content, Footer, Sider } = Layout

const size = {
  width: 30,
  height: 30
}

type SideBarItem = {
  name: string
  to: string
  icon: any
  notification?: any
}

function sideBarItems(isLoggedIn: boolean) {
  const itemsWhenNotLoggedIn: Array<SideBarItem> = [
    {name: 'Rocket Maven', to:urls.explore, icon: FaUserPlus},
    { name: 'Sign Up', to: urls.signup, icon: FaUserPlus },
    { name: 'Sign In', to: urls.login, icon: FaUserPlus }
  ]
  const itemsWhenLoggedIn: Array<SideBarItem> = [
    /* { name: "Test", to: urls.homeStub, icon: FaHome }, */
    {name: 'Rocket Maven', to:urls.explore, icon: FaUserPlus},
    { name: 'Portfolio', to: urls.portfolio, icon: FaHome },
    { name: 'Account', to: urls.account, icon: FaHome },
    { name: 'Watchlists', to: urls.watchlists, icon: FaHome }
  ]
  return isLoggedIn ? itemsWhenLoggedIn : itemsWhenNotLoggedIn
}

{
  /*
<React.Fragment>
  <item.icon />
  <Link to={item.to}>{item.name} </Link>
</React.Fragment>
*/
}

const SideBar = () => {
  const { isLoggedIn } = useStore()
  const sideBar = sideBarItems(isLoggedIn).map((item) => (
    // TODO(Jude): Space and style appropriately here
    <React.Fragment>
      <Menu.Item>
        <Link to={item.to}>{item.name} </Link>
      </Menu.Item>
    </React.Fragment>
  ))

  return (
    <Menu>
      <Subtitle>
        <a href="/">
          <img src="/testlogo.svg" width="200px" />
        </a>
      </Subtitle>
      {sideBar}
    </Menu>
  )
}

export default SideBar
