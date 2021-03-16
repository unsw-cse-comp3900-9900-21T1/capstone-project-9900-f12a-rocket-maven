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
};

type SideBarItem = {
  name: string;
  to: string;
  icon: any;
  notification?: any;
};

function sideBarItems(isLoggedIn: boolean) {
  const itemsWhenNotLoggedIn: Array<SideBarItem> = [
    { name: "Sign up", to: urls.signup, icon: FaHome },
    { name: "Login", to: urls.login, icon: FaHome },
  ];
  const itemsWhenLoggedIn: Array<SideBarItem> = [
    { name: "HomeStub", to: urls.homeStub, icon: FaHome },
    { name: "Portfolio", to: urls.portfolio, icon: FaHome },
    { name: "Account", to: urls.account, icon: FaHome },
  ];
  return isLoggedIn ? itemsWhenLoggedIn : itemsWhenNotLoggedIn;
}


const SideBar = () => {
  const { isLoggedIn } = useStore();
  const sideBar = sideBarItems(isLoggedIn).map(item => ( 
    // TODO(Jude): Space and style appropriately here
    <React.Fragment>
      <item.icon />
      <Link to={item.to}>{item.name} </Link>
    </React.Fragment>
  ))

  // Basic logout functionality - get rid of when we have a proper logout button
  const { dispatch } = useStore()
  if (isLoggedIn) {
    sideBar.push(
      <React.Fragment>
        <Link onClick={()=>{dispatch({type:'LOGOUT'})}} to={urls.root}>
          Logout
        </Link>
      </React.Fragment>
    )
  }
  return (
    <SidebarWrap>
      <Subtitle>
        Website logo maybe here
      </Subtitle>
      {sideBar}
    </SidebarWrap>
  )
}

export default SideBar;
