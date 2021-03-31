import { Fragment, useEffect } from 'react'
import { Col } from '@rocketmaven/componentsStyled/Grid'
import { Flex } from '@rocketmaven/componentsStyled/Flex'

// Temporary component to data in an object (Abandoned because of re-rendering issues)
const DataVerticalDisplay = (data: any) => {
  return (
    <Fragment>
      {
        data.data.map(([key, value]:any, index:any) => 
          <Flex>
            <Col>
              {key}
            </Col>
            <Col>
              {value}
            </Col>
          </Flex>
        )
      }
    </Fragment>
  )
}

export default DataVerticalDisplay