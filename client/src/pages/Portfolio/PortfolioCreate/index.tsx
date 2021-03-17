import { Fragment } from 'react'
import { Subtitle } from '../../../componentsStyled/Typography'
import PortfolioEditForm from '../PortfolioEditForm'

const PortfolioCreate = () => {

  return (
    <Fragment>
      <Subtitle>
        Portfolio Creation
      </Subtitle>
      <PortfolioEditForm action="Create" />
    </Fragment>
  )
}

export default PortfolioCreate