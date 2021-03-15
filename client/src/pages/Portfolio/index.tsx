import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { Switch, Route } from 'react-router-dom'
import { urls } from '../../data/urls'
import PortfolioList from './PortfolioList'
import PortfolioEdit from './PortfolioEdit'
import PortfolioCreate from './PortfolioCreate'
import PortfolioDetail from './PortfolioDetail'

const Portfolio = () => {

  return (
    <Page>
      <Title>
        {/* Remove when content's fleshed out */}
        Portfolio
      </Title>
      <Switch>
        <Route exact path={urls.portfolio} component={PortfolioList} />
        {/* TODO(Jude): crudify routes */}
        <Route path={urls.portfolio + '/detail'} component={PortfolioDetail} />
        {/* TODO(Jude): change id to portfolio:id */}
        <Route path={urls.portfolio + '/create'} component={PortfolioCreate} />
        <Route path={urls.portfolio + '/edit/:id'} component={PortfolioEdit} />
      </Switch>
    </Page>
  )
}

export default Portfolio