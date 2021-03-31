import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { Investor } from '@rocketmaven/pages/Account/types'
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