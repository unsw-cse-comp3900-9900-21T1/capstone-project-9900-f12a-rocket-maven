import { useState, useEffect } from 'react'
import {  ReactLogoImg,  } from './styled'
import Page from '../_Page'
import { Title, Text, Link, StyledLink } from '../../componentsStyled/Typography'
import { StubWrap } from '../../componentsStyled/Layouts'
import logo from '../../assets/svg/logo.svg'

const HomeStub = () => {
  const [currentTime, setCurrentTime] = useState(0);

  // Example of how front end communicates with backend. Should note that we are currently using
  // a proxy and when we move our webapp to production, things have to be configured differently
  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
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
          Edit src code and save to reload.
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
        <Text> Testing API call to backend stub - The current time is {currentTime}. </Text>
      </StubWrap>
    </Page>
  )
}

export default HomeStub;
