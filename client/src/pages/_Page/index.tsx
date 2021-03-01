import * as React from "react"
import {
  BodyWrap,
  FooterWrap,
  HeaderWrap,
  NavWrap,
  PageWrap,
} from "./styled"

type Props = {
  children: React.ReactNode
}

// This component is a wrapper for the other pages content.
// Note only the body will change and all the other sections of the DOM will
// mainly stay the same.
const Page = ({children}: Props) => {
  return (
    <PageWrap>
      <HeaderWrap>
        New Header Component here
      </HeaderWrap>
      <NavWrap>
        New Navbar Component here
      </NavWrap>
      <BodyWrap>
        {children}
      </BodyWrap>
      <FooterWrap>
        New Footer Component here
      </FooterWrap>
    </PageWrap>
  )
}



export default Page
