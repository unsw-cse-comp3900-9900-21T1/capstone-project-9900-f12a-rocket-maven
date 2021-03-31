import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaSignOutAlt } from 'react-icons/fa'
import { storeContext } from '@rocketmaven/data/app/store'
import { Text, Subtitle } from '@rocketmaven/componentsStyled/Typography'
import { useStore } from '@rocketmaven/hooks/store'
import { urls } from '@rocketmaven/data/urls'

import { Layout, Menu, Breadcrumb, message } from 'antd'

const { Header, Content, Footer } = Layout

const NavBar = () => {
  const { state } = useContext(storeContext)
  const { isLoggedIn } = state

  // Basic logout functionality - get rid of when we have a proper logout button
  const { dispatch } = useStore()

  let logoutButton = null
  if (isLoggedIn) {
    logoutButton = (
      <Menu.Item icon={FaSignOutAlt}>
        <Link
          onClick={() => {
            dispatch({ type: 'LOGOUT' })
            message.info('You have logged out!')
          }}
          to={urls.root}
        >
          Log Out
        </Link>
      </Menu.Item>
    )
  }

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: 'white' }}>
      <Subtitle>
        <a href="/">
          <img src="/testlogo.svg" width="200px" />
        </a>
      </Subtitle>
      <Menu mode="horizontal" defaultSelectedKeys={['2']} style={{ float: 'right' }}>
        <Menu.Item key="1"></Menu.Item>
        {logoutButton}
      </Menu>
    </Header>
  )
}

export default NavBar
