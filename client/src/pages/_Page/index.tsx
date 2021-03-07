import * as React from 'react'
import NavBar from '../../components/NavBar'
import {
  BodyWrap,
  FooterWrap,
  HeaderWrap,
  NavWrap,
  PageWrap,
} from "./styled"

// This component is a wrapper for the other pages content.
// Note only the body will change and all the other sections of the DOM will
// mainly stay the same.
// TODO(Jude): Find difference between ReactNode and PropsWithChildren and be consistent
type Props = {
  children: React.ReactNode
}
const Page = ({children}: Props) => {

  return (
    <PageWrap>
      <HeaderWrap>
        New Header Component here
      </HeaderWrap>
      <NavWrap>
        <NavBar/>
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
