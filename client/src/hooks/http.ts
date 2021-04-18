import { useIsLoggedIn, useStore, useUserId } from '@rocketmaven/hooks/store'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { decodeToken, isExpired } from 'react-jwt'
import { useHistory } from 'react-router'
import { urls } from '../data/urls'

type SuccessfullLoginResponse = {
  access_token: string
  refresh_token: string
}
type AuthType = 'LOGIN' | 'REGISTER'
type HttpMutation = 'POST' | 'PUT'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
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

const abstractFetch = async (fetchInput: AbstractFetchProps) => {
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

const useAbstractFetchOnMount = (url: string, refreshFlag?: number) => {
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

const useAbstractFetchOnSubmit = (url: string, method?: HttpMethod) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { accessToken, revalidateAccessToken, dispatch } = useAccessToken()
  const isLoggedIn = useIsLoggedIn()
  const routerObject = useHistory()
  const myFetch = async (apiPath: string, values?: any, redirectPath?: string) => {
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

const useAbstractFetchUpdate = (url: string, method: HttpMethod, redirectPath?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const { accessToken, revalidateAccessToken, dispatch } = useAccessToken()
  const isLoggedIn = useIsLoggedIn()
  const routerObject = useHistory()
  const myFetch = async (values: JSON) => {
    try {
      const results = await abstractFetch({
        accessToken,
        revalidateAccessToken,
        isLoading,
        setIsLoading,
        isLoggedIn,
        url: url,
        routerObject,
        redirectPath,
        method,
        values,
        dispatch
      })
      return results
    } catch (error) {
      message.error(error.message)
    }
  }
  return { isLoading, myFetch }
}

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
      message.error(error.message)
      dispatch({ type: 'LOGOUT' })
      routerObject.push(urls.root)
      throw Error(error)
    }
  }

  return { accessToken, revalidateAccessToken, dispatch }
}

export const useFetchAPIPublicOrLoggedInData = (api_part: string, setData: any): any => {
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
        const response = await fetch(`/api/v1${api_part}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        console.log('*********************** status is', response.status)
        const data = await response.json()
        if (!response.ok) {
          if (data.msg) {
            throw Error(data.msg)
          }
          throw Error(`${response.status}`)
        }
        setData(data)
        setIsLoading(false)
      } catch (error) {
        message.error(error.message)
        setData({})
        setIsLoading(false)
      }
    }
    myFetch()
    return
  }, [])

  return { isLoading }
}

export const useFetchAssetData = (tickerSymbol: string): any => {
  const endPointUrl = `/api/v1/assets/${tickerSymbol}`
  return useAbstractFetchOnMount(endPointUrl)
}

export const useFetchGetWithUserId = (urlEnd: string, refreshFlag?: number): any => {
  let userId = useUserId()
  if (!userId) {
    userId = 0
  }
  const endPointUrl = `/api/v1/investors/${userId}${urlEnd}`
  return useAbstractFetchOnMount(endPointUrl, refreshFlag)
}

// Get Requests
export const useFetchGetPublicPortfolio = (portfolioId: string): any => {
  const endPointUrl = `/api/v1/public-portfolios/${portfolioId}`
  return useAbstractFetchOnMount(endPointUrl)
}

export const useFetchTopAdditions = (): any => {
  const endPointUrl = `/api/v1/top_additions`
  return useAbstractFetchOnMount(endPointUrl)
}

export const useGetPortfolioInfo = (portfolioId: string): any => {
  const endPointUrl = `/api/v1/portfolios/${portfolioId}`
  return useAbstractFetchOnMount(endPointUrl)
}

export const useGetPortfolioHistory = (portfolioId: string): any => {
  const endPointUrl = `/api/v1/portfolios/${portfolioId}/history`
  const { data, isLoading } = useAbstractFetchOnMount(endPointUrl)
  return { data, isLoading }
}

export const useGetWatchlist = (refreshFlag?: number): any => {
  const endPointUrl = `/api/v1/watchlist`
  const { data } = useAbstractFetchOnMount(endPointUrl, refreshFlag)
  return data
}

export const useAdvancedSearch = (): any => {
  const endPointUrl = '/api/v1/explore'
  const { data, isLoading, myFetch } = useAbstractFetchOnSubmit(endPointUrl)
  return { data, isLoading, myFetch }
}

export const useGetChartData = (): any => {
  const { myFetch } = useAbstractFetchOnSubmit('/api/v1')
  return myFetch
}

// Updates requests
export const useAuth = (authType: AuthType): Function => {
  let endPointUrl = '/auth/login'
  if (authType === 'REGISTER') {
    endPointUrl = '/api/v1/investors'
  }
  const { dispatch } = useStore()
  const { myFetch } = useAbstractFetchUpdate(endPointUrl, 'POST')
  const routerObject = useHistory()
  const submit = async (values: JSON) => {
    try {
      const data: SuccessfullLoginResponse = await myFetch(values)
      dispatch({
        type: 'LOGIN',
        payload: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          userId: decodeToken(data.access_token).sub
        }
      })
      routerObject.push('/')
    } catch (error) {
      message.error(error.message)
    }
  }
  return submit
}

export const useUpdateAccountInfo = (): Function => {
  const userId = useUserId()
  const { myFetch } = useAbstractFetchUpdate(`/api/v1/investors/${userId}`, 'PUT', urls.account)
  return myFetch
}

export const useAddPortfolioEvent = (portfolioId: string): Function => {
  const { myFetch } = useAbstractFetchUpdate(
    `/api/v1/portfolios/${portfolioId}/history`,
    'POST',
    urls.portfolio
  )
  return myFetch
}

export const useUpdatePortfolioInfo = (
  methodInput: HttpMutation,
  portfolioId?: string
): Function => {
  const userId = useUserId()
  let endPointUrl = `/api/v1/investors/${userId}/portfolios`
  if (methodInput === 'PUT') {
    endPointUrl = `/api/v1/portfolios/${portfolioId}`
  }
  const { myFetch } = useAbstractFetchUpdate(endPointUrl, methodInput, urls.portfolio)
  return myFetch
}

export const useIForgot = () => {
  const { isLoading, myFetch } = useAbstractFetchUpdate('/api/v1/iforgot', 'POST')
  return { isLoading, myFetch }
}

export const usePasswordReset = () => {
  const { myFetch } = useAbstractFetchUpdate('/api/v1/pw_reset', 'POST', '/')
  return myFetch
}

export const useDeleteWatchListItem = () => {
  const urlPrefix = '/api/v1/watchlist/'
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'DELETE')
  return myFetch
}

export const useDeletePortfolio = () => {
  const urlPrefix = '/api/v1/portfolios/'
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'DELETE')
  return myFetch
}

export const useUpdateWatchListItem = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { accessToken, revalidateAccessToken, dispatch } = useAccessToken()
  const routerObject = useHistory()
  const myFetch = async (asset_id: string, context: string, price: number) => {
    try {
      const results = abstractFetch({
        accessToken,
        revalidateAccessToken,
        isLoading,
        setIsLoading,
        url: `/api/v1/watchlist/${asset_id}/${context}`,
        method: 'PUT',
        values: { price: price },
        dispatch,
        routerObject,
      })
      return results
    } catch (error) {
      message.error(error.message)
    }
  }
  return myFetch
}

export const useAddWatchListItem = () => {
  const urlPrefix = '/api/v1/watchlist/'
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'POST')
  return myFetch
}

export const useDeleteAssetPortfolioHolding = () => {
  const urlPrefix = '/api/v1/portfolios/'
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'DELETE')
  return myFetch
}