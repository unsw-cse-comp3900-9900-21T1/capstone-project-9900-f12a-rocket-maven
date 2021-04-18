
import { useIsLoggedIn, useStore } from '@rocketmaven/hooks/store'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { isExpired } from 'react-jwt'
import { useHistory } from 'react-router'
import { urls } from '../data/urls'

// File contains all react hook templates for API calls

type AbstractFetchProps = {
  url: string
  isLoading: boolean
  setIsLoading: Function
  accessToken?: string
  revalidateAccessToken: Function
  setData?: Function
  isLoggedIn?: boolean
  values?: any
  method?: HttpMethod
  redirectPath?: string
  routerObject: any
  dispatch: any
}
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const useAccessToken = () => {
  const { accessToken, refreshToken, dispatch } = useStore()
  const routerObject = useHistory()

  const revalidateAccessToken = async () => {
    try {
      if (isExpired(refreshToken)) {
        throw Error('Refresh token expired')
      }
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      })
      if (!response.ok) {
        throw Error('Not logged in, now logging out!')
      }
      const data: { access_token: string } = await response.json()
      dispatch({ type: 'REFRESH_TOKEN', payload: { accessToken: data.access_token } })
    } catch (error) {
      message.error(error.message)
      dispatch({ type: 'LOGOUT' })
      routerObject.push(urls.root)
      throw Error(error)
    }
  }

  return { accessToken, revalidateAccessToken, dispatch }
}

export const abstractFetch = async (fetchInput: AbstractFetchProps) => {
  const {
    accessToken,
    revalidateAccessToken,
    setData,
    setIsLoading,
    url,
    isLoggedIn,
    method = 'GET',
    values,
    redirectPath,
    routerObject,
    dispatch,
  } = fetchInput
  try {
    setIsLoading(true)
    if (isLoggedIn && accessToken && isExpired(accessToken)) {
      await revalidateAccessToken()
    }
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: values ? JSON.stringify(values) : undefined
    })
    const data = await response.json()

    if (!response.ok) {
      if (data.msg) {
        throw Error(data.msg)
      }
      throw Error(`Request failed - ${response.statusText}`)
    }
    if (setData) {
      setData(data)
    }
    setIsLoading(false)
    if (redirectPath && routerObject) {
      routerObject.push(redirectPath)
    }
    return data
  } catch (error) {
    if (setData) {
      setData({})
    }
    setIsLoading(false)
    if (error.message === 'Token has been revoked') {
      dispatch({ type: 'LOGOUT' })
      routerObject.push('/')
    }
    throw error
  }
}

export const useAbstractFetchOnMount = (url: string, refreshFlag?: number) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { accessToken, revalidateAccessToken, dispatch } = useAccessToken()
  const isLoggedIn = useIsLoggedIn()
  const routerObject = useHistory()
  useEffect(() => {
    const myFetch = async () => {
      try {
        await abstractFetch({
          accessToken,
          revalidateAccessToken,
          setData,
          isLoading,
          setIsLoading,
          isLoggedIn,
          url,
          dispatch,
          routerObject,
        })
      } catch (error) {
        message.error(error.message)
      }
    }
    myFetch()
  }, [refreshFlag])
  return { data, isLoading }
}

type FetchInput = {
  apiPath?: string,
  values?: any,
  redirectPath?: string
}

export const useAbstractFetchOnSubmit = (url: string, method?: HttpMethod) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { accessToken, revalidateAccessToken, dispatch } = useAccessToken()
  const isLoggedIn = useIsLoggedIn()
  const routerObject = useHistory()
  const myFetch = async ({ apiPath, values, redirectPath }: FetchInput) => {
    try {
      const results = await abstractFetch({
        accessToken,
        revalidateAccessToken,
        setData,
        isLoading,
        setIsLoading,
        isLoggedIn,
        url: url + (apiPath ? apiPath : ''),
        dispatch,
        routerObject,
        method,
        redirectPath,
        values,
      })
      return results
    } catch (error) {
      message.error(error.message)
    }
  }
  return { data, isLoading, myFetch }
}
