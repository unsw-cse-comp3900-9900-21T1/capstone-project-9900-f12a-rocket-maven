import AssetSearchBox from '@rocketmaven/components/AssetSearchBox'
import { storeContext } from '@rocketmaven/data/app/store'
import { urls } from '@rocketmaven/data/urls'
import { useStore } from '@rocketmaven/hooks/store'
import { HeaderWrap } from '@rocketmaven/pages/_Page/styled'
import { Menu, message } from 'antd'
import { useContext } from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

const NavBar = ({ children }: Props) => {
  const { state } = useContext(storeContext)
  const { isLoggedIn } = state

  // Basic logout functionality - get rid of when we have a proper logout button
  const { dispatch } = useStore()

  let logoutButton = null
  if (isLoggedIn) {
    logoutButton = (
      <Menu.Item icon={<FaSignOutAlt />}>
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
    <HeaderWrap>
      {children}
      <AssetSearchBox showSearch style={{ width: '80%' }} />

      <Menu mode="horizontal" defaultSelectedKeys={['2']} style={{ float: 'right' }}>
        <Menu.Item key="1"></Menu.Item>
        {logoutButton}
      </Menu>
    </HeaderWrap>
  )
}

export default NavBar
