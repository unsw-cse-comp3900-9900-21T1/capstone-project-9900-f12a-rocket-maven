import * as React from 'react'
import NavBar from '@rocketmaven/components/NavBar'
import { BodyWrap, FooterWrap, HeaderWrap, PageWrap } from './styled'
import { Layout, Menu, Breadcrumb } from 'antd'

const { Header, Content, Footer } = Layout

// This component is a wrapper for the other pages content.
// Note only the body will change and all the other sections of the DOM will
// mainly stay the same.
// TODO(Jude): Find difference between ReactNode and PropsWithChildren and be consistent
type Props = {
  children: React.ReactNode
}
const Page = ({ children }: Props) => {
  return (
    <PageWrap>
      <NavBar />
      <BodyWrap className="site-layout">
        {children}
      </BodyWrap>
      <Footer style={{ textAlign: 'center' }}>Rocket Maven ©2021</Footer>
    </PageWrap>
  )
}

export default Page
