import { useFetchGetWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
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