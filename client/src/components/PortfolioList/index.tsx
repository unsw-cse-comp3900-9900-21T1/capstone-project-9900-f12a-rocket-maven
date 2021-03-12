import { Fragment, useEffect } from 'react'
import { useUserId } from '../../hooks/store'

const PortfolioList = () => {
  
  const userId = useUserId()

  // useEffect(() => {
  //   // TODO(Jude) improve fetch
  //   const url = `/api/v1/investors/${userId}/portfolios`
  //   fetch(url)
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log("*************** data is ", data)
  //   })
  //   .catch(error =>{
  //     throw error
  //   })
  // })

  return (
    <Fragment>
      hi
    </Fragment>
  )
}

export default PortfolioList