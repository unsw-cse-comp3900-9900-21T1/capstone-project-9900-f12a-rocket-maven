import { useFetchGetWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
import AccountDetailCard from './AccountDetailCard'

type AccountFetch = {
  data: Investor,
  isLoading: boolean
}

const AccountDetail = () => {
  
  const { data, isLoading }: AccountFetch = useFetchGetWithUserId('')
  const accountDataList = data && data.investor
  console.log("****************** account data list is", accountDataList)

  if (isLoading) {
    return null
  } else {
    return (
      <AccountDetailCard investor={data.investor} />
    )
  }

}

export default AccountDetail