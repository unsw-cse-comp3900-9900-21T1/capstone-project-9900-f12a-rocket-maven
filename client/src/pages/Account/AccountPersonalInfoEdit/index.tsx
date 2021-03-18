import { useFetchGetWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
import AccountPersonalInfoForm from './AccountPersonalInfoForm'

type AccountInfoFetch = {
  data: Investor,
  isLoading: boolean,
}

const AccountPersonalInfoEdit = () => {
  const { data, isLoading }: AccountInfoFetch = useFetchGetWithUserId('')
  return ( isLoading ?  null : <AccountPersonalInfoForm investorData={data} />)
}
export default AccountPersonalInfoEdit
