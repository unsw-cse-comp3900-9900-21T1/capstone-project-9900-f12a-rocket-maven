import { useState, useEffect } from 'react'
import {  ReactLogoImg,  } from './styled'
import Page from '../_Page'
import { Title, Text, Code, Link, StyledLink } from '../../componentsStyled/Typography'
import { StubWrap } from '../../componentsStyled/Layouts'
import logo from '../../assets/svg/logo.svg'
import { useStore } from '../../hooks/store'

const HomeStub = () => {

  const [time, setTime] = useState();

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


  const { accessToken } = useStore()
  // Testing api call with authentication
  // TODO(Jude): Separate fetch requests and create refresh token handling
  useEffect(() => {
    fetch('/api/v1/investors', {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response  => {
      console.log("Response status is ", response.status)
      return response.json()
    })
    .then(data => {
      console.log("************8 data is ", data)
    })
    .catch(error =>{
      throw error
    })
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
