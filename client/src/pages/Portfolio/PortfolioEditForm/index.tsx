 import * as Yup from 'yup'
import { Fragment } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { MySelect, MyTextInput } from '../../../forms'
import { numberRequired, stringRequired, booleanRequired} from '../../../forms/validators'
import { useFetchMutationWithUserId } from '../../../hooks/http'
import { PortfolioInfo } from '../types'

const schema = Yup.object({
  buying_power: numberRequired,
  competition_portfolio: stringRequired,
  description: stringRequired,
  name: stringRequired,
  tax_residency: stringRequired,
  visibility: booleanRequired,
})
type Props = {
  portfolioInfo?: {
    portfolio: PortfolioInfo
  }
  portfolioId?: string
}

const PortfolioEditForm = ({portfolioInfo, portfolioId}: Props) => {
  let initialValues: PortfolioInfo = {
    buying_power: 10000,
    competition_portfolio: 'What kind of string?',
    description: '',
    name: '',
    tax_residency: '',
    // TODO(Jude): Add visibility
    visibility: true,

    // Bottom 2 not used, just here for typing validation
    creation_date: '',
    id: 0,
  }
  let urlEnd = '/portfolios'
  if (portfolioInfo) {
    initialValues = {...portfolioInfo.portfolio}
    urlEnd = urlEnd + `/${portfolioId}`
  }
  console.log("**************** initial values are", initialValues)
  // Will add redirect after we get some seed data. Right now it's useful to be able to populate
  // values quickly
  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, portfolioInfo ? 'PUT' : 'POST')

  return (
    <Fragment>
      {/* TODO(Jude): Refactor and minimise: Seprate schema */}
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("***************** values submitted are ", values)
          // Clear id since api doesnt need it, and date because that's set by the db
          setValuesAndFetch({
            ...values,
            id: undefined,
            creation_date: undefined,
          })
        }}
      >
        <Form>
          <MyTextInput
            label="Buying Power"
            name="buying_power"
            type="number"
          />
          <MyTextInput
            label="Competition Portfolio"
            name="competition_portfolio"
            type="text"
          />
          <MyTextInput
            label="Description"
            name="description"
            type="text"
          />
          <MyTextInput
            label="Name"
            name="name"
            type="text"
          />
          {/* Issue with country coming back with full name but it requiring a country code to update  */}
          <MySelect label="Tax Residency" name="tax_residency">
            <option value="">Select Country</option>
            <option value="AU">Australia</option>
            <option value="US">United States</option>
            <option value="GB">England</option>
          </MySelect>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Fragment>
  )
}

export default PortfolioEditForm