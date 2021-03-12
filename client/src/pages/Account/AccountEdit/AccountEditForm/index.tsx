 import * as Yup from 'yup'
import { useEffect, Fragment, useState } from 'react'
import { Subtitle } from '../../../../componentsStyled/Typography'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { MyCheckbox, MySelect, MyTextInput } from '../../../../forms'
import { storeContext } from '../../../../data/app/store'
import { stringRequired, emailRequired, countryRequired, genderRequired} from '../../../../forms/validators'
import { useFetchGetWithUserId, useFetchMutationWithUserId } from '../../../../hooks/http'
import { Investor } from '../../types'

const schema = Yup.object({
  username: stringRequired,
  //TODO(Jude): properly create password validation; double input to check
  password: stringRequired,
  firstName: stringRequired,
  lastName: stringRequired,
  countryOfResidency: countryRequired,
  dateOfBirth: stringRequired,
  email: emailRequired,
  // TODO(Jude): Add categories; male, female other
  gender: genderRequired,
})

type Props = {
  investorData: Investor
}

const AccountEditForm = ({investorData}: Props) => {

  
  // Double API call, maybe fix
  const setValuesAndFetch: Function = useFetchMutationWithUserId('', 'PUT')

  return (
    <Fragment>
      <Subtitle>
        Account Edit
      </Subtitle>
      {/* TODO(Jude): Refactor and minimise: Seprate schema */}
      <Formik
        initialValues={{
          username: investorData.investor.username,
          password: '',
          //TODO(Jude): properly define password validation
          firstName: investorData.investor.first_name,
          lastName: investorData.investor.last_name,
          countryOfResidency: investorData.investor.country_of_residency,
          dateOfBirth: investorData.investor.date_of_birth,
          email: investorData.investor.email,
          gender: investorData.investor.gender,
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          const submissionValues = {
             "country_of_residency": values.countryOfResidency,
             "date_of_birth": values.dateOfBirth,
             "email": values.email,
             "email_verified": true,
             "first_name": values.firstName,
             "gender": values.gender,
             "last_name": values.lastName,
             "password": values.password,
             "username": values.username,
             "visibility": true
          }
          setValuesAndFetch(submissionValues)
        }}
      >
        <Form>
          <MyTextInput
            label="Username"
            name="username"
            type="text"
          />
          {/* TODO(Jude): Input password twice validation */}
          <MyTextInput
            label="Password"
            name="password"
            type="text"
          />
          <MyTextInput
            label="Email"
            name="email"
            type="text"
          />
          <MyTextInput
            label="First Name"
            name="firstName"
            type="text"
          />
          <MyTextInput
            label="Last Name"
            name="lastName"
            type="text"
          />
          <MySelect label="Country of Residency" name="countryOfResidency">
            <option value="">Select Country</option>
            <option value="AU">Australia</option>
            <option value="US">United States</option>
            <option value="GB">England</option>
            <option value="XX">Antarctica</option>
          </MySelect>
          <MySelect label="Gender" name="gender">
            <option value="">Select One</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="none">Neither</option>
          </MySelect>
          <MyTextInput
            label="Date of Birth"
            name="dateOfBirth"
            type="text"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Fragment>
  )
}

export default AccountEditForm