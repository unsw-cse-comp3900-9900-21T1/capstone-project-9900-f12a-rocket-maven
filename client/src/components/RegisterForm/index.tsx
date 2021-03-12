 import * as Yup from 'yup'
import { useContext, Fragment } from 'react'
import { Subtitle } from '../../componentsStyled/Typography'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { MyCheckbox, MySelect, MyTextInput } from '../../forms'
import { storeContext } from '../../data/store'
import { stringRequired, emailRequired, countryRequired, acceptedRequired, genderRequired} from '../../forms/validators'

const schema = Yup.object({
  username: stringRequired,
  //TODO(Jude): properly create password validation; double input to check
  password: stringRequired,
  firstName: stringRequired,
  lastName: stringRequired,
  countryOfResidency: countryRequired,
  acceptedTerms: acceptedRequired,
  dateOfBirth: stringRequired,
  email: emailRequired,
  // TODO(Jude): Add categories; male, female other
  gender: genderRequired,
})

const RegisterForm = () => {

  // const { dispatch } = useContext(storeContext)

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
          firstName: '',
          lastName: '',
          countryOfResidency: '',
          acceptedTerms: false,
          dateOfBirth: '',
          email: '',
          gender: '',
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("**************** values are ", values)
          // {
          //   "country_of_residency": "string",
          //   "date_of_birth": "2021-03-11",
          //   "email": "string",
          //   "email_verified": true,
          //   "first_name": "string",
          //   "gender": "string",
          //   "last_name": "string",
          //   "password": "string",
          //   "username": "string",
          //   "visibility": true
          // }
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

          fetch('/api/v1/investors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionValues)
          })
          .then(response => {
            // TODO(Jude): USE constants for status codeos
            if (response.status === 201) {
              return response.json()
            }
            // TODO(Jude) Error Snackbar
            return Promise.reject("Registration problem ")
          })
          .then(data => {
            console.log("Success!! data returned is", data)
            console.log("********************* data is ", data)
            // TODO(Jude) Success Snackbar
              // dispatch({type: "LOGIN", payload: {
              //   accessToken: data.access_token,
              //   refreshToken: data.refresh_token,
              //   userId: 0,
              // }})
            
          })
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
          <MyCheckbox name="acceptedTerms">
            I accept the terms and conditions
          </MyCheckbox>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Fragment>
  )
}

export default RegisterForm