import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react'
import { useStore } from './store'

// Type data where this function is being called
// Maybe add a generic if possible?
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

interface AuthToken {
  exp:  number;
  fresh: boolean;
  iat: number;
  jti: string;
  nbf: number;
  sub: number;
  type: string;
}

type AuthType = 'LOGIN' | 'REGISTER'
export const useAuth = (authType: AuthType): Function => {

  let url = '/auth/login'
  if (authType === 'REGISTER') {
    url = '/api/v1/investors'
  }

  const { dispatch } = useStore()
  const [ values, setValues ] = useState()

  useEffect(() => {
    if (!values) {
      return
    }
    fetch(url, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    })
    .then(res => {
      console.log("*********************** status is", res.status)
      return res.json()
    })
    .then(data => {
      console.log("********************* data is ", data)
      // TODO(Jude): Handle failures more neatly, ask if they can return an error install of an error message
      // or do I just have to look at the res.status? Former seems preferable, because that would be the point having .catch
      // in the fetch chain
      if (data.msg === 'Operation failed!') {
        throw Error(data.msg)
      }
      dispatch({type: "LOGIN", payload: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        userId: jwt_decode<AuthToken>(data.access_token).sub
      }})
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
