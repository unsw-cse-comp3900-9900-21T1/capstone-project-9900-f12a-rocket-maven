import { useFetchGetWithUserId } from '@rocketmaven/hooks/http'
import AccountSecurityInfoForm from '@rocketmaven/pages/Account/AccountSecurityInfoEdit/AccountSecurityInfoForm'
import { Investor } from '@rocketmaven/pages/Account/types'

type AccountInfoFetch = {
  data: Investor
  isLoading: boolean
}

const AccountSecurityInfoEdit = () => {
  const { data, isLoading }: AccountInfoFetch = useFetchGetWithUserId('')
  return isLoading ? null : <AccountSecurityInfoForm investorData={data} />
}

export default AccountSecurityInfoEdit
