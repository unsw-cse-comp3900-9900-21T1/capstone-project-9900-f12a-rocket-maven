import { BrowserRouter } from 'react-router-dom'
import { AppWrap, ContentWrap } from './styled'
import Routes from './Routes'
import SideBar from './SideBar'
import { Store } from '../data/store'

const App = () => {

  return (
    <BrowserRouter>
      <Store>
        <AppWrap>
          <SideBar />
          <ContentWrap>
            <Routes />
          </ContentWrap>
        </AppWrap>
      </Store>
    </BrowserRouter>
  )
}

export default App;
