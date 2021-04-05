import Page from '@rocketmaven/pages/_Page'
import React, { useEffect, useState } from 'react'
import { Title } from '@rocketmaven/componentsStyled/Typography'
import { useFetchTopAdditions } from '@rocketmaven/hooks/http'

const TopAdditions = () => {
  const { data, isLoading } = useFetchTopAdditions()
  console.log('************8 data is ', data)
  return (
    <Page>
      <Title>
        Top Additions
      </Title>
    </Page>
  )
}

export default TopAdditions
