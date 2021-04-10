import { ContentWrap } from '@rocketmaven/App/styled'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { Layout, Menu } from 'antd'
import styled from 'styled-components'
const { Header, Content, Sider } = Layout

const sidebarWidth = 200
const headerHeight = 84

export const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 24px;
  background: #fafbfc;
`

export const SiderWrap = styled(Sider)`
  min-height: 100vh;
  min-width: ${sidebarWidth}px;
  max-width: ${sidebarWidth}px;
  background-color: white;
`

export const MenuItemWrap = styled(Menu.Item)`
  ${SiderWrap}:not(.ant-layout-sider-collapsed) & {
    margin: 1rem 2rem;
    border-radius: 12px;
  }
  ${SiderWrap}.ant-layout-sider-collapsed & {
    padding-left: 32px !important;
  }
`
export const SidebarWrap = styled(Menu)`
  min-height: 100vh;
  position: fixed;
  overflow-x: hidden;
`

export const LogoWrap = styled.div`
  height: ${headerHeight - 4}px;
  margin-bottom: 2rem;
`

export const HeaderWrap = styled(Header)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  ${ContentWrap}[data-collapsed="false"] & {
    margin-left: ${sidebarWidth}px;
  }
  ${ContentWrap}[data-collapsed="true"] & {
    margin-left: 80px;
  }
  background: white;
  height: ${headerHeight}px;
  line-height: ${headerHeight}px !important;
`

export const BodyWrap = styled(Content)`
  margin-top: ${headerHeight}px;
  min-height: 80vh;
`

export const FooterWrap = styled(Card)`
  background: #fafbfc;
  width: 100%;
  padding-right: 24px;
`
