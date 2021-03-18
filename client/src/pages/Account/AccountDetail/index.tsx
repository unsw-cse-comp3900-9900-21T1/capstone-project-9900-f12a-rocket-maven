import { useFetchGetWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
import AccountDetailCard from './AccountDetailCard'

type AccountFetch = {
  data: Investor,
  isLoading: boolean
}

const AccountDetail = () => {
  
  const { data, isLoading }: AccountFetch = useFetchGetWithUserId('')

  return (isLoading ? null : <AccountDetailCard investor={data.investor} />)
}

export default AccountDetail