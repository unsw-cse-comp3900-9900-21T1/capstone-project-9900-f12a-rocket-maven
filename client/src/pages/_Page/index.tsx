import * as React from 'react'
import { BodyWrap, FooterWrap, PageWrap } from './styled'

// This component is a wrapper for the other pages content.
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
