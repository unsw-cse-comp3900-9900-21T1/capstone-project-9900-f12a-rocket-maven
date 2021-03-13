import { useContext } from 'react'
import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { MyCheckbox, MySelect, MyTextInput } from '../../forms'
import { storeContext } from '../../data/store'
 import * as Yup from 'yup'

const LogIn = () => {
  const { dispatch } = useContext(storeContext)

  return (
    <Page>
      <Title>
        Login Stub
      </Title>
      {/* TODO(Jude): Refactor and minimise: Seprate schema */}
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          acceptedTerms: false, // added for our checkbox
          jobType: '', // added for our select
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          acceptedTerms: Yup.boolean()
            .required('Required')
            .oneOf([true], 'You must accept the terms and conditions.'),
          jobType: Yup.string()
            .oneOf(
              ['designer', 'development', 'product', 'other'],
              'Invalid Job Type'
            )
            .required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          fetch('/api/v1/login-stub', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
          .then(res => res.json())
          .then(data => {
            console.log("************** response is", data)
            if (data.msg === 'Form submission successfull') {
              dispatch({type: "LOGIN"})
            }
          })
          // TODO(Jude): Maybe add error and success snack bars here
        }}
      >
        <Form>
          <MyTextInput
            label="First Name"
            name="firstName"
            type="text"
            placeholder="Jane"
          />

          <MyTextInput
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Doe"
          />

          <MyTextInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@formik.com"
          />

          <MySelect label="Job Type" name="jobType">
            <option value="">Select a job type</option>
            <option value="designer">Designer</option>
            <option value="development">Developer</option>
            <option value="product">Product Manager</option>
            <option value="other">Other</option>
          </MySelect>

          <MyCheckbox name="acceptedTerms">
            I accept the terms and conditions
          </MyCheckbox>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Page>
  )
}

export default LogIn
