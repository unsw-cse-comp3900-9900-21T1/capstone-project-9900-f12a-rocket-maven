import { Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import HoldingHistory from '@rocketmaven/pages/Portfolio/HoldingHistory'
import PortfolioAssetCreate from '@rocketmaven/pages/Portfolio/PortfolioAssetCreate'
import PortfolioCreate from '@rocketmaven/pages/Portfolio/PortfolioCreate'
import PortfolioDetail from '@rocketmaven/pages/Portfolio/PortfolioDetail'
import PortfolioEdit from '@rocketmaven/pages/Portfolio/PortfolioEdit'
import PortfolioHistory from '@rocketmaven/pages/Portfolio/PortfolioHistory'
import PortfolioList from '@rocketmaven/pages/Portfolio/PortfolioList'
import Page from '@rocketmaven/pages/_Page'
import { Route, Switch } from 'react-router-dom'

const Portfolio = () => {
  return (
    <Page>
      <Title>Portfolio</Title>
      <Switch>
        <Route exact path={urls.portfolio} component={PortfolioList} />
        <Route path={urls.portfolio + '/create'} component={PortfolioCreate} />
        <Route path={urls.portfolio + '/:id/edit'} component={PortfolioEdit} />
        <Route exact path={urls.portfolio + '/:id/history'} component={PortfolioHistory} />
        <Route path={urls.portfolio + '/:id/addremove'} component={PortfolioAssetCreate} />
        <Route path={urls.portfolio + '/:id/holdings/:hid'} component={HoldingHistory} />
        <Route exact path={urls.portfolio + '/:id'} component={PortfolioDetail} />
      </Switch>
    </Page>
  )
}

export default Portfolio
