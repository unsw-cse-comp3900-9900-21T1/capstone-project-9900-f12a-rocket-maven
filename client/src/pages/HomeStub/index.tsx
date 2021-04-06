import { useState, useEffect } from 'react'
import {  ReactLogoImg,  } from '@rocketmaven/pages/HomeStub/styled'
import Page from '@rocketmaven/pages/_Page'
import { Title, Text, Code, Link, StyledLink } from '@rocketmaven/componentsStyled/Typography'
import { StubWrap } from '@rocketmaven/componentsStyled/Layouts'
import logo from '@rocketmaven/assets/svg/logo.svg'
import { useStore } from '@rocketmaven/hooks/store'
import { useAccessToken } from '@rocketmaven/hooks/http'

const HomeStub = () => {

  const [time, setTime] = useState();
  const { accessToken, revalidateAccessToken } = useAccessToken()

  useEffect(() => {
    fetch('/api/v1/get-time')
    .then(res => res.json())
    .then(data => {
      setTime(data.currentTime)
    })
    .catch(error =>{
      throw error
    })
  }, [])


  // Testing api call with refresh token
  // TODO(Jude): Separate fetch requests and create refresh token handling
  useEffect(() => {
    // try {
    //   revalidateAccessToken()
    // } catch(e) {
    //   console.log("**************** error is ", e)
    // }

  }, [])

  return (
    <Page>
      <StubWrap>
        <Title>
          Home Page (Temp)
        </Title>
        <ReactLogoImg alt={`App-logo`} src={logo}/>
        <Text >
          Testing
        </Text>
        <Text color={'green'} >
          Testing Conditional styling
        </Text>
        <Text>
          Edit src <Code>code</Code> and save to reload.
        </Text>
        <Link
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </Link>
        <StyledLink
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testing Link Styling - Learn React
        </StyledLink>
        <Text> 
          Testing API call to backend - The last time this fetch was called was at {time}.
         </Text>
      </StubWrap>
    </Page>
  )
}

export default HomeStub;
