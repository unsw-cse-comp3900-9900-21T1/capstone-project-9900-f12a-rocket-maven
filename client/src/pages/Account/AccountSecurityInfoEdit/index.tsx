import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { Investor } from '@rocketmaven/pages/Account/types'
import AccountSecurityInfoForm from './AccountSecurityInfoForm'

type AccountInfoFetch = {
  data: Investor,
  isLoading: boolean,
}

const AccountSecurityInfoEdit = () => {
  const { data, isLoading }: AccountInfoFetch = useFetchGetWithUserId('')
  return ( isLoading ?  null : <AccountSecurityInfoForm investorData={data} />)
}

export default AccountSecurityInfoEdit