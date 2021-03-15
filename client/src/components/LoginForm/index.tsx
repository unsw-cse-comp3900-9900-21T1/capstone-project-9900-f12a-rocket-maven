import * as Yup from 'yup'
import { useContext, Fragment } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { stringRequired } from '../../forms/validators'
import { MyCheckbox, MySelect, MyTextInput } from '../../forms'
import { useAuth } from '../../hooks/http'

const schema = Yup.object({
  username: stringRequired,
  //TODO(Jude): properly define password validation
  password: stringRequired,
})

const LoginForm = () => {

  const setValuesAndPost = useAuth('LOGIN')

  return (
    <Fragment>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          // TODO(Jude): Success and failure snackbar. I think formik has it's own onError functionality we can use
          setValuesAndPost(values)
          // TODO(Jude): Maybe add error and success snack bars here
        }}
      >
        <Form>
          <MyTextInput
            label="Username"
            name="username"
            type="text"
            placeholder="Jane"
          />

          <MyTextInput
            label="Password"
            name="password"
            type="text"
            placeholder="Doe"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Fragment>
  )
}

export default LoginForm