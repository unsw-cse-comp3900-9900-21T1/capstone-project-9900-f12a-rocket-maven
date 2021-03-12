import { useState, useContext, useEffect } from 'react'
import { storeContext } from '../data/app/store'

export const useUserId = () => {
  const { state } = useContext(storeContext)
  const { userId } = state
  return userId
}

export const useStore = () => {
  const { state } = useContext(storeContext)
  const { accessToken, refreshToken, userId } = state
  return { accessToken, refreshToken, userId }
}
