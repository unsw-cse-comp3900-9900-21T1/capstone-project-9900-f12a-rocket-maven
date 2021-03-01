import React from 'react'
import { AppWrap, Content } from './styled'
import Routes from './Routes'
import SideBar from './SideBar'

const App = () => {

  // TODO(Jude): Add store with useContext
  return (
    <AppWrap>
      <SideBar />
      <Content>
        <Routes />
      </Content>
    </AppWrap>
  )
}

export default App;
