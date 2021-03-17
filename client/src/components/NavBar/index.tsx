import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa'
import { storeContext } from '../../data/app/store'
import { Text, Subtitle } from '../../componentsStyled/Typography'
import { useStore } from "../../hooks/store";
import { urls } from '../../data/urls'

import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

const NavBar = () => {
  const { state } = useContext(storeContext)
  const { isLoggedIn } = state

  // Basic logout functionality - get rid of when we have a proper logout button
  const { dispatch } = useStore()
  
  let logoutButton = null;
  if (isLoggedIn) {
  logoutButton =  <Menu.Item icon={FaSignOutAlt}>
          <Link onClick={()=>{dispatch({type:'LOGOUT'})}} to={urls.root}>
            Logout
          </Link>
        </Menu.Item>;
  }
  

  return (
    <div>
      
      <div className="logo" />
      <Menu mode="horizontal" style={{float: 'right'}} defaultSelectedKeys={['2']}>
        {/*<Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        */}
        {logoutButton}
      </Menu>
    </div>
  )
}

export default NavBar;
