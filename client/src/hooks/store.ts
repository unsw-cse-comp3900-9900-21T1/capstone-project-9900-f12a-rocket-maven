import { useContext } from 'react'
import { storeContext } from '../data/app/store'
import { countryCodeToName } from '../data/country-code-to-name'

// TODO(Jude): Consider separating into more specific 'use' functions
export const useStore = () => {
  const { state, dispatch } = useContext(storeContext)
  const { isLoggedIn, accessToken, refreshToken, userId } = state
  return { isLoggedIn, accessToken, refreshToken, userId, dispatch }
}

export const useUserId = () => {
  const { state } = useContext(storeContext)
  return state.userId
}

export const useIsLoggedIn = () => {
  const { state } = useContext(storeContext)
  return state.isLoggedIn
}

// Not exactly the right place..
export const useSortedCountryList = () => {
  // TODO(Jude): Get a proper list of countries instead of processing
  const countryList = Object.entries(countryCodeToName).sort((a,b) => {
    if(a[1] > b[1]) return 1;
    if(a[1] < b[1]) return -1;
    return 0;
  })
  return countryList
}
