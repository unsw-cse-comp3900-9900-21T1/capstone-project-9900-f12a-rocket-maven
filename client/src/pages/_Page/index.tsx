import * as React from 'react'
import NavBar from '@rocketmaven/components/NavBar'
import {
  BodyWrap,
  FooterWrap,
  HeaderWrap,
  NavWrap,
  PageWrap,
} from "./styled"
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

// This component is a wrapper for the other pages content.
// Note only the body will change and all the other sections of the DOM will
// mainly stay the same.
// TODO(Jude): Find difference between ReactNode and PropsWithChildren and be consistent
type Props = {
  children: React.ReactNode
}
const Page = ({children}: Props) => {

  return (
  <Layout className="layout" style={{height: "100vh"}}>
      <NavWrap>
        <NavBar/>
      </NavWrap>
      <Content style={{margin:"20px", overflow: "scroll"}}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Rocket Maven ©2021</Footer>
    </Layout>
  )
}



export default Page
