import React from "react"
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'
import { SidebarWrap } from "./styled"
import { urls } from '../../data/urls'
import { Subtitle } from '../../componentsStyled/Typography'
import { useStore } from "../../hooks/store";

const size = {
  width: 30,
  height: 30,
}

type SideBarItem = {
  name: string,
  to: string,
  icon: any,
  notification?: any,
}

const sideBarItems: Array<SideBarItem> = [
  {
    name: 'Sign up',
    to: urls.signup,
    icon: FaHome,
  },
  {
    name: 'Login',
    to: urls.login,
    icon: FaHome,
  },
  {
    name: 'Portfolio',
    to: urls.portfolio,
    icon: FaHome,
  },
  {
    name: 'Account',
    to: urls.account,
    icon: FaHome,
  },
]

const SideBar = () => {
  const sideBar = sideBarItems.map(item => ( 
    // TODO(Jude): Space and style appropriately here
    // TODO(Jude): Find out why icon isn't rendering
    <React.Fragment>
      {item.icon}
      <Link to={item.to}>
        {item.name}
      </Link>
    </React.Fragment>
  ))

  // Basic logout functionality - get rid of when we have a proper logout button
  const { dispatch } = useStore()
  sideBar.push(
    <React.Fragment>
      <Link onClick={()=>{dispatch({type:'LOGOUT'})}} to={urls.root}>
        Logout
      </Link>
    </React.Fragment>
  )
  return (
    <SidebarWrap>
      <Subtitle>
        Website logo maybe here
      </Subtitle>
      {sideBar}
    </SidebarWrap>
  )
}

export default SideBar
