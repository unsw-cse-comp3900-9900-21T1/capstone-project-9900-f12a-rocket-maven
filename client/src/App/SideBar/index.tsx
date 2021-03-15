import React from "react"
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'
import { SidebarWrap } from "./styled"
import { urls } from '../../data/urls'
import { Subtitle } from '../../componentsStyled/Typography'

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
    name: 'HomeStub',
    to: urls.root,
    icon: FaHome,
  },
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
    name: 'Login2',
    to: urls.login2,
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

const SideBar = () => (
  <SidebarWrap>
    <Subtitle>
      Website logo maybe here
    </Subtitle>
    {sideBarItems
      .map(item => {
        return (
          // TODO(Jude): Space and style appropriately here
          // TODO(Jude): Find out why icon isn't rendering
          <React.Fragment>
            {item.icon}
            <Link to={item.to}>
              {item.name}
            </Link>
          </React.Fragment>
        )
      })}
  </SidebarWrap>
)

export default SideBar
