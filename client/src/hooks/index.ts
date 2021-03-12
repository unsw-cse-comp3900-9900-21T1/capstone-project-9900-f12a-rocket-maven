import { useContext } from 'react'
import { storeContext } from '../data/store'

export const useTokens = () => {
  const { state } = useContext(storeContext)
  const { accessToken, refreshToken } = state
  return { accessToken, refreshToken }
}
