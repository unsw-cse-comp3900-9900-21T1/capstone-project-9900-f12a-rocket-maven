
import { useState, useEffect } from 'react'
import { useStore } from './store'

// May rename this to file
// A DRY attempt
// Type data where this function is being called
// Maybe add a generic instead of the any if possible?
export const useFetchGetWithUserId = (urlEnd:string): any => {

  const { accessToken, refreshToken, userId } = useStore()
  const [ data, setData ] = useState({})

  useEffect(() => {
    fetch(`/api/v1/investors/${userId}${urlEnd}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    }})
    .then(res => {
      console.log("*********************** status is")
      return res.json()
    })
    .then(data => {
      console.log("********************* data is ", data)
      setData(data)
    })
    .catch(error =>{
      // set logout and redirect to main page
      // Or something to do with the refresh token first
      throw error
    })
  }, [])

  return data
}
type HttpMutation = 'POST' | 'PUT'
// Might be a bit forced in using hooks
export const useFetchMutationWithUserId = (urlEnd:string, methodInput: HttpMutation): Function => {

  const { accessToken, refreshToken, userId } = useStore()
  const [ values, setValues ] = useState()

  useEffect(() => {
    if (!values) {
      return
    }
    fetch(`/api/v1/investors/${userId}${urlEnd}`, {
      method: methodInput,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values)
    })
    .then(res => {
      console.log("*********************** status is", res.status)
      return res.json()
    })
    .then(data => {
      console.log("********************* data is ", data)
    })
    .catch(error =>{
      console.log("*********************** error is ", error)
      // set logout and redirect to main page
      // Or something to do with the refresh token first
      throw error
    })
  }, [values])

  return setValues
}

// export const useGetInvestorInformation = (urlEnd:string): Investor | null => {

//   const { accessToken, refreshToken, userId } = useStore()
//   const [ data, setData ] = useState(null)

//   useEffect(() => {
//     fetch(`/api/v1/investors/${userId}${urlEnd}`, {
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//     }})
//     .then(res => {
//       console.log("*********************** status is")
//       return res.json()
//     })
//     .then(data => {
//       console.log("********************* data is ", data)
//       setData(data)
//     })
//     .catch(error =>{
//       // Or something to do with the refresh token first
//       // Logout and redirect to main page
//       throw error
//     })
//   }, [])

//   return data
// }

// Note(Jude): Storing Just in case I see value in this style
// export const useGetUserPortfolioList = (): PortfolioPagination | null => {

//   const { accessToken, refreshToken, userId } = useStore()
//   const [ data, setData ] = useState(null)

//   useEffect(() => {
//     fetch(`/api/v1/investors/${userId}/portfolio`, {
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//     }})
//     .then(res => {
//       console.log("*********************** status is")
//       return res.json()
//     })
//     .then(data => {
//       console.log("********************* data is ", data)
//       setData(data)
//     })
//     .catch(error =>{
//       // Or something to do with the refresh token first
//       // Logout and redirect to main page
//       throw error
//     })
//   }, [])

//   return data
// }