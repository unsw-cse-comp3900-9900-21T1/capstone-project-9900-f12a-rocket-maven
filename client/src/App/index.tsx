import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Routes from '@rocketmaven/App/Routes'
import SideBar from '@rocketmaven/App/SideBar'
import { AppWrap, ContentWrap } from '@rocketmaven/App/styled'
import NavBar from '@rocketmaven/components/NavBar'
import { Store } from '@rocketmaven/data/app/store'
import { SiderWrap } from '@rocketmaven/pages/_Page/styled'
import { Layout } from 'antd'
import 'antd/dist/antd.less'
import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
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
