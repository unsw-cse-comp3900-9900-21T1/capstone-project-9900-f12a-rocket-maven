import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { Switch, Route } from 'react-router-dom'
import { urls } from '../../data/urls'
import PortfolioList from './PortfolioList'
import PortfolioEdit from './PortfolioEdit'
import PortfolioCreate from './PortfolioCreate'
import PortfolioDetail from './PortfolioDetail'
import PortfolioHistory from './PortfolioHistory'
import PortfolioHoldings from './PortfolioHoldings'
import PortfolioAssetCreate from './PortfolioAssetCreate'
import HoldingHistory from './HoldingHistory'

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
        {/* TODO(Jude): change id to portfolio:id */}
        <Route path={urls.portfolio + '/create'} component={PortfolioCreate} />
        <Route path={urls.portfolio + '/:id/edit'} component={PortfolioEdit} />
        <Route exact path={urls.portfolio + '/:id/history'} component={PortfolioHistory} />
        <Route path={urls.portfolio + '/:id/addremove'} component={PortfolioAssetCreate} />
        <Route path={urls.portfolio + '/:id/holdings/:hid'} component={HoldingHistory} />
        <Route path={urls.portfolio + '/:id/holdings'} component={PortfolioHoldings} />
        <Route exact path={urls.portfolio + '/:id'} component={PortfolioDetail} />
      </Switch>
    </Page>
  )
}

export default Portfolio
