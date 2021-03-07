import React from 'react'
import { AppWrap, ContentWrap } from './styled'
import Routes from './Routes'
import SideBar from './SideBar'

const App = () => {

  // TODO(Jude): Add store with useContext
  return (
    <AppWrap>
      <SideBar />
      <ContentWrap>
        <Routes />
      </ContentWrap>
    </AppWrap>
  )
}

export default App;
