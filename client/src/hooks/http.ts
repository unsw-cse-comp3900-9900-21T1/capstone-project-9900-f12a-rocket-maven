import { useStore, useUserId } from '@rocketmaven/hooks/store'
import { message } from 'antd'
import { decodeToken } from 'react-jwt'
import { useHistory } from 'react-router'
import { useAbstractFetchOnMount, useAbstractFetchOnSubmit } from './_http'

type SuccessfullLoginResponse = {
  access_token: string
  refresh_token: string
}
type AuthType = 'LOGIN' | 'REGISTER'
type HttpMutation = 'POST' | 'PUT'

// Get Requests
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

export const useFetchLeaderBoard = (): any => {
  const endPointUrl = `/api/v1/leaderboard`
  return useAbstractFetchOnMount(endPointUrl)
}

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

export const useGetPortfolioHistory = (portfolioId: string, refreshFlag?: number): any => {
  const endPointUrl = `/api/v1/portfolios/${portfolioId}/history`
  const { data, isLoading } = useAbstractFetchOnMount(endPointUrl, refreshFlag)
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
  const { myFetch } = useAbstractFetchOnSubmit(endPointUrl, 'POST')
  const routerObject = useHistory()
  const submit = async (values: JSON) => {
    const data: SuccessfullLoginResponse = await myFetch({ values })
    if (data) {
      dispatch({
        type: 'LOGIN',
        payload: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          userId: decodeToken(data.access_token).sub
        }
      })
      message.info(authType === 'REGISTER' ? 'Sign Up Successful' : 'Login Successful')
      routerObject.push('/')
    }
  }
  return submit
}

export const useUpdateAccountInfo = (): Function => {
  const userId = useUserId()
  const urlPrefix = `/api/v1/investors/${userId}`
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'PUT')
  return myFetch
}

export const useAddPortfolioEvent = (portfolioId: string): Function => {
  const urlPrefix = `/api/v1/portfolios/${portfolioId}/history`
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'POST')
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
  const { myFetch } = useAbstractFetchOnSubmit(endPointUrl, methodInput)
  return myFetch
}

export const useIForgot = () => {
  const urlPrefix = '/api/v1/iforgot'
  const { isLoading, myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'POST')
  return { isLoading, myFetch }
}

export const usePasswordReset = () => {
  const urlPrefix = '/api/v1/pw_reset'
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'POST')
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
  const urlPrefix = '/api/v1/watchlist/'
  const { myFetch } = useAbstractFetchOnSubmit(urlPrefix, 'PUT')
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

export const useUpdateAssetPortfolioHistory = (): any => {
  const endPointUrl = `/api/v1/portfolios/`
  const { myFetch } = useAbstractFetchOnSubmit(endPointUrl, 'PUT')
  return myFetch
}

export const useDeleteAssetPortfolioHistory = (): any => {
  const endPointUrl = `/api/v1/portfolios/`
  const { myFetch } = useAbstractFetchOnSubmit(endPointUrl, 'DELETE')
  return myFetch
}
