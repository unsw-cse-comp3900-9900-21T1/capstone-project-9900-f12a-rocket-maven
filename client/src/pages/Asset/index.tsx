import Page from '@rocketmaven/pages/_Page'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { urls } from '@rocketmaven/data/urls'
import { Route, Switch } from 'react-router-dom'
import AssetView from '@rocketmaven/pages/Asset/AssetView'

const Asset = () => {
  return (
    <Page>
      <Title>Asset</Title>
      <Switch>
        <Route path={urls.asset + '/:ticker_symbol/'} component={AssetView} />
      </Switch>
    </Page>
  )
}

export default Asset
