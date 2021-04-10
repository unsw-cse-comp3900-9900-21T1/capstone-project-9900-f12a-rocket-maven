import { urls } from '@rocketmaven/data/urls'
import { useStore } from '@rocketmaven/hooks/store'
import { LogoWrap, MenuItemWrap, SidebarWrap } from '@rocketmaven/pages/_Page/styled'
import React from 'react'
import {
  FaBriefcase,
  FaFileAlt,
  FaNetworkWired,
  FaSignInAlt,
  FaStar,
  FaUser,
  FaUserPlus
} from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

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
    { name: 'Explore', to: urls.explore, icon: <FaNetworkWired /> },
    { name: 'Sign Up', to: urls.signup, icon: <FaUserPlus /> },
    { name: 'Log In', to: urls.login, icon: <FaSignInAlt /> }
  ]
  const itemsWhenLoggedIn: Array<SideBarItem> = [
    { name: 'Explore', to: urls.explore, icon: <FaNetworkWired /> },
    { name: 'Portfolio', to: urls.portfolio, icon: <FaBriefcase /> },
    { name: 'Account', to: urls.account, icon: <FaUser /> },
    { name: 'Watchlist', to: urls.watchlists, icon: <FaStar /> },
    { name: 'Report', to: urls.report, icon: <FaFileAlt /> }
  ]
  return isLoggedIn ? itemsWhenLoggedIn : itemsWhenNotLoggedIn
}

const Logo = () => {
  return (
    <LogoWrap>
      <a href="/">
        <img src="/testlogo.svg" width="200px" />
      </a>
    </LogoWrap>
  )
}

type Props = {
  collapsed: boolean
}

const SideBar = ({ collapsed }: Props) => {
  const location = useLocation()
  const { isLoggedIn } = useStore()

  const items = sideBarItems(isLoggedIn)
  const sideBar = items.map((item) => (
    <React.Fragment>
      <MenuItemWrap key={item.to} icon={item.icon}>
        <Link to={item.to}>{item.name} </Link>
      </MenuItemWrap>
    </React.Fragment>
  ))

  return (
    <SidebarWrap
      defaultSelectedKeys={['/']}
      selectedKeys={[location.pathname]}
      style={{ border: '0' }}
    >
      <Logo />
      {sideBar}
    </SidebarWrap>
  )
}

export default SideBar
