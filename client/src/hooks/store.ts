import { useContext } from 'react'
import { storeContext } from '../data/app/store'

export const useStore = () => {
  const { state, dispatch } = useContext(storeContext)
  const { accessToken, refreshToken, userId } = state
  return { accessToken, refreshToken, userId, dispatch }
}
