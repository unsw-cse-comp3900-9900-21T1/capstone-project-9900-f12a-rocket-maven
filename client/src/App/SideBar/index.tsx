import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaUserPlus } from 'react-icons/fa'
// import { SidebarWrap } from "./styled"
import { urls } from '@rocketmaven/data/urls'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useStore } from '@rocketmaven/hooks/store'

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
    { name: 'Explore', to: urls.explore, icon: FaUserPlus },
    { name: 'Sign Up', to: urls.signup, icon: FaUserPlus },
    { name: 'Log In', to: urls.login, icon: FaUserPlus }
  ]
  const itemsWhenLoggedIn: Array<SideBarItem> = [
    /* { name: "Test", to: urls.homeStub, icon: FaHome }, */
    { name: 'Explore', to: urls.explore, icon: FaUserPlus },
    { name: 'Portfolio', to: urls.portfolio, icon: FaHome },
    { name: 'Account', to: urls.account, icon: FaHome },
    { name: 'Watchlists', to: urls.watchlists, icon: FaHome }
  ]
  return isLoggedIn ? itemsWhenLoggedIn : itemsWhenNotLoggedIn
}

const SideBar = () => {
  const location = useLocation()
  const { isLoggedIn } = useStore()
  
  const items = sideBarItems(isLoggedIn);
  const sideBar = items.map((item) => (
    <React.Fragment>
      <Menu.Item key={item.to}>
        <Link to={item.to}>{item.name} </Link>
      </Menu.Item>
    </React.Fragment>
  ))

  return (
    <Menu defaultSelectedKeys={['/']} selectedKeys={[location.pathname]} style={{ border: "0" }}>
      {sideBar}
    </Menu>
  )
}

export default SideBar
