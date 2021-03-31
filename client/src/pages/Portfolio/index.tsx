import Page from '@rocketmaven/pages/_Page'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { Switch, Route } from 'react-router-dom'
import { urls } from '@rocketmaven/data/urls'
import PortfolioList from '@rocketmaven/pages/Portfolio/PortfolioList'
import PortfolioEdit from '@rocketmaven/pages/Portfolio/PortfolioEdit'
import PortfolioCreate from '@rocketmaven/pages/Portfolio/PortfolioCreate'
import PortfolioDetail from '@rocketmaven/pages/Portfolio/PortfolioDetail'
import PortfolioHistory from '@rocketmaven/pages/Portfolio/PortfolioHistory'
import PortfolioHoldings from '@rocketmaven/pages/Portfolio/PortfolioHoldings'
import PortfolioAssetCreate from '@rocketmaven/pages/Portfolio/PortfolioAssetCreate'
import HoldingHistory from '@rocketmaven/pages/Portfolio/HoldingHistory'

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
