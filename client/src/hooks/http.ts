import { useIsLoggedIn, useStore, useUserId } from '@rocketmaven/hooks/store'
import { message } from 'antd'
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { isExpired } from 'react-jwt'
import { useHistory } from 'react-router'
import { urls } from '../data/urls'

//TODO(Jude): Can probably extract and generalise fetchFunctions and reuse in each hook
// Rushed implementation of authToken refresh
// Getting a 404 error with the fetch request
export const useAccessToken = () => {
  const { accessToken, refreshToken, dispatch } = useStore()
  const routerObject = useHistory()

  const revalidateAccessToken = async () => {
    try {
      console.log('************************token refresh in progress')
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
      console.log('************************token refresh successfull')
      dispatch({ type: 'REFRESH_TOKEN', payload: { accessToken: data.access_token } })
    } catch (error) {
      // Refresh token expired
      dispatch({ type: 'LOGOUT' })
      message.error(error.message)
      routerObject.push(urls.root)
      throw Error(error)
    }
  }

  return { accessToken, revalidateAccessToken }
}

const abstractFetchLoggedInURL = async (
  accessToken: any,
  revalidateAccessToken: any,
  data: any,
  setData: any,
  isLoading: any,
  setIsLoading: any,
  url: string
) => {
  try {
    setIsLoading(true)
    if (isExpired(accessToken) || true) {
      await revalidateAccessToken()
    }
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    const data = await response.json()

    if (!response.ok) {
      if (data.msg) {
        if (data.msg == 'Token has been revoked' || data.msg == 'Not enough segments') {
        }
        throw Error(data.msg)
      }
      throw Error(`Request failed - ${response.statusText}`)
    }

    setData(data)
    setIsLoading(false)
  } catch (error) {
    message.error(error.message)
    setData({})
    setIsLoading(false)
  }
}

export const useFetchGetPublicPortfolio = (portfolioId: string): any => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    const myFetch = async () => {
      try {
        setIsLoading(true)
        if (isLoggedIn && isExpired(accessToken)) {
          await revalidateAccessToken()
        }
        const response = await fetch(`/api/v1/public-portfolios/${portfolioId}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        console.log('*********************** status is', response.status)
        if (!response.ok) {
          throw Error(`${response.status}`)
        }
        const data = await response.json()
        setData(data)
        setIsLoading(false)
      } catch (error) {
        setData({})
        setIsLoading(false)
      }
    }
    myFetch()
    return
  }, [])

  return { data, isLoading }
}

export const useFetchAPIPublicData = (api_part: string, setData: any): any => {

  useEffect(() => {
    const myFetch = async () => {
      try {
        const response = await fetch(`/api/v1${api_part}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw Error(`${response.status}`)
        }
        const data = await response.json()
        setData(data)
      } catch (error) {
        setData({})
      }
    }
    myFetch()
    return
  }, [])
}

export const useFetchTopAdditions = (): any => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    const myFetch = async () => {
      try {
        setIsLoading(true)
        if (isLoggedIn && isExpired(accessToken)) {
          await revalidateAccessToken()
        }
        const response = await fetch(`/api/v1/top_additions`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        console.log('*********************** status is', response.status)
        if (!response.ok) {
          throw Error(`${response.status}`)
        }
        const data = await response.json()
        setData(data)
        setIsLoading(false)
      } catch (error) {
        setData({})
        setIsLoading(false)
      }
    }
    myFetch()
    return
  }, [])

  return { data, isLoading }
}

export const useFetchGetWithUserId = (urlEnd: string, refreshFlag?: number): any => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const userId = useUserId()

  useEffect(() => {
    abstractFetchLoggedInURL(
      accessToken,
      revalidateAccessToken,
      data,
      setData,
      isLoading,
      setIsLoading,
      `/api/v1/investors/${userId}${urlEnd}`
    )
  }, [refreshFlag])

  return { data, isLoading }
}

type HttpMutation = 'POST' | 'PUT'
export const useFetchMutationWithUserId = (
  urlEnd: string,
  methodInput: HttpMutation,
  redirectPath?: string
): Function => {
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const userId = useUserId()
  const routerObject = useHistory()
  const [values, setValues] = useState()

  // TODO(Jude): Get rid of useEffect and just use return an async fetch that takes in values to submit
  useEffect(() => {
    if (!values) {
      return
    }
    const myFetch = async () => {
      try {
        if (isExpired(accessToken)) {
          await revalidateAccessToken()
        }
        const response = await fetch(`/api/v1/investors/${userId}${urlEnd}`, {
          method: methodInput,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(values)
        })
        console.log('*********************** status is', response.status)
        const data = await response.json()

        if (!response.ok) {
          if (data.msg) {
            throw Error(data.msg)
          }
          throw Error(`Request failed - ${response.statusText}`)
        }
        console.log('********************* data is ', data)
        if (redirectPath) {
          routerObject.push(redirectPath)
        }
      } catch (error) {
        message.error(error.message)
      }
    }
    myFetch()
  }, [values])

  return setValues
}

interface AuthToken {
  exp: number
  fresh: boolean
  iat: number
  jti: string
  nbf: number
  sub: number
  type: string
}

type AuthType = 'LOGIN' | 'REGISTER'
export const useAuth = (authType: AuthType): Function => {
  let url = '/auth/login'
  if (authType === 'REGISTER') {
    url = '/api/v1/investors'
  }

  const { dispatch } = useStore()
  const [values, setValues] = useState()
  const routerObject = useHistory()

  // TODO(Jude): Get rid of useEffect and just use return an async fetch that takes in values to submit
  useEffect(() => {
    if (!values) {
      return
    }
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then((res) => {
        console.log('*********************** status is', res.status)
        if (!res.ok) {
          // TODO(Jude): Better error handling
          throw Error(
            `${authType === 'REGISTER' ? 'Failed to Sign up' : 'Failed to Log in'} - ${
              res.statusText
            }`
          )
        }
        return res.json()
      })
      .then((data) => {
        console.log('********************* data is ', data)
        dispatch({
          type: 'LOGIN',
          payload: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            userId: jwt_decode<AuthToken>(data.access_token).sub
          }
        })
        routerObject.push('/')
      })
      .catch((error) => {
        // TEMP
        message.error(error.messge)
      })
  }, [values])

  return setValues
}

export const useGetPortfolioInfo = (portfolioId: string): any => {
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abstractFetchLoggedInURL(
      accessToken,
      revalidateAccessToken,
      data,
      setData,
      isLoading,
      setIsLoading,
      `/api/v1/portfolios/${portfolioId}`
    )
  }, [])

  return { data, isLoading }
}

export const useUpdatePortfolioInfo = (
  methodInput: HttpMutation,
  portfolioId?: string,
): Function => {
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const routerObject = useHistory()
  const userId = useUserId()

  let url = `/api/v1/investors/${userId}/portfolios`
  if (methodInput === 'PUT') {
    url = `/api/v1/portfolios/${portfolioId}`
  }

  // fix type into json
  const submit = async (values: any) => {
    try {
      if (isExpired(accessToken)) {
        await revalidateAccessToken()
      }
      const response = await fetch(url, {
        method: methodInput,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(values)
      })
      
      if (!response.ok) {
          throw Error(response.statusText)
      }
      routerObject.push(urls.portfolio)
    } catch (error) {
        message.error(error.messge)
    }
  }

  return submit
}

export const useGetPortfolioHistory = (portfolioId: string): any => {
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abstractFetchLoggedInURL(
      accessToken,
      revalidateAccessToken,
      data,
      setData,
      isLoading,
      setIsLoading,
      `/api/v1/portfolios/${portfolioId}/history`
    )
  }, [])

  return data
}

export const useGetWatchlist = (): any => {
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abstractFetchLoggedInURL(
      accessToken,
      revalidateAccessToken,
      data,
      setData,
      isLoading,
      setIsLoading,
      `/api/v1/watchlist`
    )
  }, [])

  return data
}

export const useGetPortfolioHoldings = (portfolioId: string): any => {
  const { accessToken, revalidateAccessToken } = useAccessToken()
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abstractFetchLoggedInURL(
      accessToken,
      revalidateAccessToken,
      data,
      setData,
      isLoading,
      setIsLoading,
      `/api/v1/portfolios/${portfolioId}/holdings`
    )
  }, [])

  return data
}
