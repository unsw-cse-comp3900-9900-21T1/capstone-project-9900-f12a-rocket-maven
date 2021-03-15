import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react'
import { useHistory } from "react-router";
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
      if (!res.ok) {
        // TODO(Jude) add response message like underneath. Not doing it until we do page hiding
        // to avoid unneccessary calls

      }
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
export const useFetchMutationWithUserId = (urlEnd:string, methodInput: HttpMutation, redirectPath?: string): Function => {

  const { accessToken, refreshToken, userId } = useStore()
  const [ values, setValues ] = useState()
  const routerObject = useHistory()

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
      if (!res.ok) {
        // TODO(Jude): Better error handling
        throw Error(`Mutation failed - ${res.statusText}`)
      }
      return res.json()
    })
    .then(data => {
      console.log("********************* data is ", data)
      // When this section is reac
      if (redirectPath) {
        routerObject.push(redirectPath)
      }
    })
    .catch(error =>{
      alert(error)
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
  const routerObject = useHistory()

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
      if (!res.ok) {
        // TODO(Jude): Better error handling
        throw Error(`${authType === 'REGISTER' ? 'Failed to Sign up' : 'Failed to Log in'} - ${res.statusText}`)
      }
      return res.json()
    })
    .then(data => {
      console.log("********************* data is ", data)
      dispatch({type: "LOGIN", payload: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        userId: jwt_decode<AuthToken>(data.access_token).sub
      }})
      routerObject.push('/')
    })
    .catch(error =>{
      // TEMP
      alert(error)
    })
  }, [values])

  return setValues
}
