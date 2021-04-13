import { Fragment } from 'react'
import { Subtitle } from '@rocketmaven/componentsStyled/Typography'
import PortfolioEditForm from '@rocketmaven/pages/Portfolio/PortfolioEditForm'

const PortfolioCreate = () => {
  return (
    <Fragment>
      <Subtitle>Portfolio Creation</Subtitle>
      <PortfolioEditForm action="Create" />
    </Fragment>
  )
}

export default PortfolioCreate
