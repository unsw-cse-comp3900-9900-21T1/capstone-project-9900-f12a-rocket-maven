import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { useState, useEffect } from 'react'
import { DummyPortfolioCard } from '../../components/DummyPortfolioCard'

const PortfolioDetail = () => {

  const [portfolio, setPortfolio] = useState();

  // Note(Jude): Not sure if I'm using useEffect properly, should I be passing portfolio as an argument in the callback?
  useEffect(() => {
    fetch('/api/v1/portfolio-stub')
    .then(res => res.json())
    .then(data => {
      // Don't know why portfolio is coming back as an array
      setPortfolio(data.portfolio[0])
      console.log("*********************** portfolio is ", portfolio)
    })
    .catch(error =>{
      throw error
    })
  
  }, [])
  return (
    <Page>
      <Title>
        Portfolio
      </Title>
      <DummyPortfolioCard portfolio={portfolio} />
    </Page>
  )
}

export default PortfolioDetail
