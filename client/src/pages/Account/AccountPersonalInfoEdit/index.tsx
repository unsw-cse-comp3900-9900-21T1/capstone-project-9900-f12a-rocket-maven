import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import { Investor } from '@rocketmaven/pages/Account/types'
import AccountPersonalInfoForm from '@rocketmaven/pages/Account/AccountPersonalInfoEdit/AccountPersonalInfoForm'

type AccountInfoFetch = {
  data: Investor,
  isLoading: boolean,
}

const AccountPersonalInfoEdit = () => {
  const { data, isLoading }: AccountInfoFetch = useFetchGetWithUserId('')
  return ( isLoading ?  null : <AccountPersonalInfoForm investorData={data} />)
}
export default AccountPersonalInfoEdit
