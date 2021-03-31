import styled from 'styled-components'
import { Layout, Menu } from 'antd'
import { StyledLink } from '@rocketmaven/componentsStyled/Typography'

const { Header, Content } = Layout

const sidebarWidth = 200
const headerHeight = 84

export const PageWrap = styled.div`
  overflow: scroll;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 24px;
  background: #f0f2f5;
`

export const SidebarWrap = styled(Menu)`
  min-height: 100vh;
  min-width: ${sidebarWidth}px;
  max-width: ${sidebarWidth}px;
  position: fixed;
`

export const SideBarInvisible = styled.div`
  min-height: 100vh;
  min-width: ${sidebarWidth}px;
  max-width: ${sidebarWidth}px;
  visibility: hidden;
`

export const LogoWrap = styled.div`
  height: ${headerHeight - 4}px;
`

export const HeaderWrap = styled(Header)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  margin-left: ${sidebarWidth}px;
  background: white;
  height: ${headerHeight}px;
  line-height: ${headerHeight}px;
`

export const BodyWrap = styled(Content)`
  margin-top: ${headerHeight}px;
`

export const FooterWrap = styled.footer``
