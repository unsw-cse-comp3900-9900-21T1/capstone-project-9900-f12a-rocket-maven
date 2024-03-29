import { notification } from 'antd'

export const validatePriceInput = (
  context: string,
  price: number,
  currentPrice: number,
  assetId: string
) => {
  let openMessage = false
  if (context === 'high') {
    if (price < currentPrice) {
      openMessage = true
    }
  }
  if (context === 'low') {
    if (price > currentPrice) {
      openMessage = true
    }
  }
  if (openMessage) {
    notification.info({
      message: `${assetId} ${context} alert!`,
      description: `Value is currently ${currentPrice}.`
    })
    return true
  }
  return true
}
