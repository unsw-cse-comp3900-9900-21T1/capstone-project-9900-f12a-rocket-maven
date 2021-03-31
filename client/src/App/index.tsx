import { BrowserRouter } from 'react-router-dom'
import { AppWrap, ContentWrap } from '@rocketmaven/App/styled'
import Routes from '@rocketmaven/App/Routes'
import SideBar from '@rocketmaven/App/SideBar'
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
