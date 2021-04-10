import { urls } from '@rocketmaven/data/urls'
import Page from '@rocketmaven/pages/_Page'
import { Button, Col, Row } from 'antd'
import { FaBalanceScale, FaHeart, FaSearch, FaTrophy } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export type AssetSearch = {
  ticker_symbol: string
  asset_additional: string
  market_cap: number
  country: string
  name: string
  industry: string
  current_price: number
  price_last_updated: Date
  currency: string
  data_source: string
}

export type AssetSearchPagination = {
  next: string
  pages: number
  prev: string
  total: number
  results: [AssetSearch]
}

const Explore = () =>
  <Page>
    <Row justify="center" style={{ minHeight: '100vh' }}>
      <Col style={{ height: '100vh' }}>
        <h1>Explore Rocket Maven</h1>
        <Row style={{ marginBottom: '0.5rem' }}>
          <Button type="primary">
            <Link to={urls.advancedSearch}>
              <FaSearch /> Find Assets
            </Link>
          </Button>
        </Row>
        <Row style={{ marginBottom: '0.5rem' }}>
          <Button type="primary">
            <Link to={urls.leaderboard}>
              <FaTrophy /> Portfolio Competition Leaderboard
            </Link>
          </Button>
        </Row>
        <Row style={{ marginBottom: '0.5rem' }}>
          <Button type="primary">
            <Link to={urls.topAdditions}>
              <FaHeart /> Top Additions
            </Link>
          </Button>
        </Row>
        <Row style={{ marginBottom: '0.5rem' }}>
          <Button type="primary">
            <Link to={urls.compare}>
              <FaBalanceScale /> Compare Assets
            </Link>
          </Button>
        </Row>
      </Col>
    </Row>
  </Page>


export default Explore
