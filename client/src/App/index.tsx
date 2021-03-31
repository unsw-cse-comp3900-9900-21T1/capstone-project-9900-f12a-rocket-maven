import { BrowserRouter } from 'react-router-dom'
import { AppWrap, ContentWrap } from './styled'
import Routes from './Routes'
import SideBar from './SideBar'
import NavBar from '@rocketmaven/components/NavBar'
import { Store } from '@rocketmaven/data/app/store'
import 'antd/dist/antd.less';

const App = () => {

  return (
    <BrowserRouter>
      <Store>
        <AppWrap>
          <NavBar />
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
