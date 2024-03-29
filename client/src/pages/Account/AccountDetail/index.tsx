import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import AccountDetailCard from '@rocketmaven/pages/Account/AccountDetail/AccountDetailCard'
import { Investor } from '@rocketmaven/pages/Account/types'
import { isEmpty } from 'ramda'

type AccountFetch = {
  data: Investor
  isLoading: boolean
}

const AccountDetail = () => {
  const { data, isLoading }: AccountFetch = useFetchGetWithUserId('')
  if (data && !isEmpty(data)) {
    return isLoading ? null : <AccountDetailCard investor={data.investor} />
  }
  return null
}

export default AccountDetail
