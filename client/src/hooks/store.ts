import { useContext } from 'react'
import { storeContext } from '../data/app/store'

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
