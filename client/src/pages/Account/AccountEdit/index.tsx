import { isEmpty } from 'ramda'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '../../../hooks/http'
import { Investor } from '../types'
import AccountEditForm from './AccountEditForm'

const AccountEdit = () => {
  const investorData: Investor = useFetchGetWithUserId('')
  return ( !isEmpty(investorData) ? <AccountEditForm investorData={investorData} /> : null)
}

export default AccountEdit