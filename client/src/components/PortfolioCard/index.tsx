import { Card } from '@rocketmaven/componentsStyled/Card'
import { currencyCodeToName } from '@rocketmaven/data/currency-code-to-name'
import { useDeleteAssetPortfolioHolding } from '@rocketmaven/hooks/http'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import {
  Descriptions,
  Divider,
  Input,
  Modal,
  Table
} from 'antd'
import { useState } from 'react'
import PortfolioCardTitle from './PortfolioCardTitle'
import PortfolioStatistics from './PortfolioStatistics'
import RecommendedAssets from './RecomendedAssets'
import { createActionsList, createColumns } from './tableDefinitions'

type Props = {
  portfolio: PortfolioInfo
  refreshPortfolios: () => void
  singleView?: boolean
}

const PortfolioCard = ({ portfolio, refreshPortfolios, singleView = false }: Props) => {
  const [isShareModalVisible, setIsShareModalVisible] = useState(false)
  const [modalShareURL, setModalShareURL] = useState('')
  const showModalForShare = () => {
    setIsShareModalVisible(true)
  }

  const handleOkForShare = () => {
    setIsShareModalVisible(false)
  }

  const handleCancelForShare = () => {
    setIsShareModalVisible(false)
  }

  const deleteAssetPortfolioHoldingFetch = useDeleteAssetPortfolioHolding()

  const deleteAssetPortfolioHolding = async (e: any) => {
    const asset_id = e.target.getAttribute('title')
    const portfolio_id = e.target.getAttribute('aria-valuenow')
    const path = `${portfolio_id}/holdings`
    const values = { asset_id: asset_id }
    await deleteAssetPortfolioHoldingFetch({
      apiPath: path,
      values,
      redirectPath: '/'
    })
  }

  let currencyPrefix = ''
  if (portfolio.currency && portfolio.currency in currencyCodeToName) {
    Object.entries(currencyCodeToName).forEach((keyVal) => {
      if (keyVal[0] == portfolio.currency) {
        currencyPrefix = keyVal[1]['symbol']
      }
    })
  }

  const columns = createColumns({
    portfolioId: portfolio.id,
    currencyPrefix,
    singleView,
    isCompetitionPortfolio: portfolio.competition_portfolio,
    deleteAssetPortfolioHolding
  })

  const actionsList = createActionsList({
    singleView,
    portfolio,
    setModalShareURL,
    showModalForShare,
  })

  return (
    <Card
      bodyStyle={{ paddingTop: '0px' }}
      style={singleView ? { width: '90%', overflowX: 'auto', padding: '0px' } : { padding: '0px' }}
      title={
        <PortfolioCardTitle
          portfolio={portfolio}
          refreshPortfolios={refreshPortfolios}
          singleView={singleView}
        />}
      actions={actionsList}
    >
      <Modal
        title="Share Portfolio"
        visible={isShareModalVisible}
        onOk={handleOkForShare}
        onCancel={handleCancelForShare}
      >
        <Input value={modalShareURL} />
      </Modal>
      <Descriptions column={2} size="small" bordered style={{ marginBottom: '1rem' }}>
        {singleView ? (
          <Descriptions.Item label="Owner">{portfolio.investor.username}</Descriptions.Item>
        ) : null}
        {portfolio.competition_portfolio ? (
          <Descriptions.Item label="Buying Power">
            {portfolio.buying_power.toFixed(2)}
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label="Tax Residency">{portfolio.tax_residency}</Descriptions.Item>
      </Descriptions>
      <PortfolioStatistics
        portfolio={portfolio}
        currencyPrefix={currencyPrefix}
      />
      <RecommendedAssets portfolio={portfolio} />
      <Divider>Holdings</Divider>
      <Table
        columns={columns}
        dataSource={portfolio.portfolio_asset_holding.filter(
          (portfolio_asset_holding) => portfolio_asset_holding.available_units > 0
        )}
        rowKey="id"
      />
    </Card>
  )
}

export default PortfolioCard
