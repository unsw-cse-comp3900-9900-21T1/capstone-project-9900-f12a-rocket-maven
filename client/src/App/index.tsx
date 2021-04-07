import { BrowserRouter } from 'react-router-dom'
import { AppWrap, ContentWrap } from '@rocketmaven/App/styled'
import { SiderWrap } from '@rocketmaven/pages/_Page/styled'
import Routes from '@rocketmaven/App/Routes'
import SideBar from '@rocketmaven/App/SideBar'
import { Store } from '@rocketmaven/data/app/store'
import 'antd/dist/antd.less'
import NavBar from '@rocketmaven/components/NavBar'
import { Layout } from 'antd'
import React, { useState } from 'react'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
const { Header, Content, Sider } = Layout

const App = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <Store>
        <AppWrap>
          <SiderWrap trigger={null} collapsible collapsed={collapsed} theme="light">
            <SideBar collapsed={collapsed} />
          </SiderWrap>

          <ContentWrap data-collapsed={collapsed}>
            <NavBar>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => {
                  setCollapsed(!collapsed)
                }
              })}
            </NavBar>
            <Routes />
          </ContentWrap>
        </AppWrap>
      </Store>
    </BrowserRouter>
  )
}

export default App
