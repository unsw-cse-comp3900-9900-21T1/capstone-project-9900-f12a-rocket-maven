import { storeContext } from '@rocketmaven/data/app/store'
import { countryCodeToName } from '@rocketmaven/data/country-code-to-name'
import { currencyCodeToName } from '@rocketmaven/data/currency-code-to-name'
import { useContext } from 'react'

export const useStore = () => {
  const { state, dispatch } = useContext(storeContext)
  const { isLoggedIn, accessToken, refreshToken, userId } = state
  return { isLoggedIn, accessToken, refreshToken, userId, dispatch }
}

export const useAdvancedSearchParams = () => {
  const { state, dispatch } = useContext(storeContext)
  const { searchParams } = state
  const { currentPage, queryParams, cachedData } = searchParams
  return { currentPage, queryParams, cachedData, dispatch }
}

export const useUserId = () => {
  const { state } = useContext(storeContext)
  return state.userId
}

export const useIsLoggedIn = () => {
  const { state } = useContext(storeContext)
  return state.isLoggedIn
}

export const useSortedCountryList = () => {
  const countryList = Object.entries(countryCodeToName).sort((a, b) => {
    if (a[1] > b[1]) return 1
    if (a[1] < b[1]) return -1
    return 0
  })
  return countryList
}

export const useSortedCurrencyList = () => {
  const currencyList = Object.entries(currencyCodeToName)
    .map((e: any) => [e[0], e[1].name_plural])
    .sort((a, b) => {
      if (a[1] > b[1]) return 1
      if (a[1] < b[1]) return -1
      return 0
    })
  return currencyList
}
