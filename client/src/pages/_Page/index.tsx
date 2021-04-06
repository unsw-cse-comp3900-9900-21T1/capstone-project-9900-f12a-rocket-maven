import * as React from 'react'
import { BodyWrap, FooterWrap, HeaderWrap, PageWrap } from './styled'
import { Layout, Menu, Breadcrumb } from 'antd'

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
      <BodyWrap className="site-layout">{children}</BodyWrap>
      <footer>
        <FooterWrap style={{ textAlign: 'center' }}>Rocket Maven ©2021</FooterWrap>
      </footer>
    </PageWrap>
  )
}

export default Page
