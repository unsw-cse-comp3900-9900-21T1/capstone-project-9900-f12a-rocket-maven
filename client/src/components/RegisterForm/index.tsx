 import * as Yup from 'yup'
import { useContext, Fragment } from 'react'
import { Subtitle } from '../../componentsStyled/Typography'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { MyCheckbox, MySelect, MyTextInput } from '../../forms'
import { stringRequired, emailRequired, countryRequired, acceptedRequired, genderRequired} from '../../forms/validators'
import { useAuth } from '../../hooks/http'

const schema = Yup.object({
  username: stringRequired,
  //TODO(Jude): properly create password validation; double input to check
  password: stringRequired,
  first_name: stringRequired,
  last_name: stringRequired,
  country_of_residency: countryRequired,
  accepted_terms: acceptedRequired,
  date_of_birth: stringRequired,
  email: emailRequired,
  gender: genderRequired,
})

const RegisterForm = () => {

  const setValuesAndPost = useAuth('REGISTER')

  return (
    <Fragment>
      <Subtitle>
        Register
      </Subtitle>
      {/* TODO(Jude): Refactor and minimise: Seprate schema */}
      <Formik
        initialValues={{
          username: '',
          password: '',
          //TODO(Jude): properly define password validation
          first_name: '',
          last_name: '',
          country_of_residency: '',
          accepted_terms: false,
          date_of_birth: '',
          email: '',
          gender: '',
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          // TODO(Jude): Success and failure snackbar. I think formik has it's own onError functionality we can use
          try {
            setValuesAndPost({
              ...values,
              accepted_terms: undefined,
            })
          } catch(error) {
            console.log("****************  error is ", error)
          }
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
            name="first_name"
            type="text"
          />
          <MyTextInput
            label="Last Name"
            name="last_name"
            type="text"
          />
          <MySelect label="Country of Residency" name="country_of_residency">
            <option value="">Select Country</option>
            <option value="AU">Australia</option>
            <option value="US">United States</option>
            <option value="GB">England</option>
          </MySelect>
          <MySelect label="Gender" name="gender">
            <option value="">Select One</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="none">Neither</option>
          </MySelect>
          <MyTextInput
            label="Date of Birth"
            name="date_of_birth"
            type="text"
          />
          <MyCheckbox name="accepted_terms">
            I accept the terms and conditions
          </MyCheckbox>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Fragment>
  )
}

export default RegisterForm