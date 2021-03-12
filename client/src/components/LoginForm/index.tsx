import * as Yup from 'yup'
import { useContext, Fragment } from 'react'
import jwt_decode from "jwt-decode";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { stringRequired } from '../../forms/validators'
import { MyCheckbox, MySelect, MyTextInput } from '../../forms'
import { storeContext } from '../../data/app/store'

// TODO(Jude): Maybe move somewhere better
interface AuthToken {
  exp:  number;
  fresh: boolean;
  iat: number;
  jti: string;
  nbf: number;
  sub: number;
  type: string;
}

const schema = Yup.object({
  username: stringRequired,
  //TODO(Jude): properly define password validation
  password: stringRequired,
})

const LoginForm = () => {

  const { dispatch } = useContext(storeContext)

  return (
    <Fragment>
      {/* TODO(Jude): Refactor and minimise: Seprate schema */}
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("**************** submission ", values)
          fetch('/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
          .then(response => {
            if (response.status === 200) {
              return response.json()
            }
            return Promise.reject()
          })
          .then(data => {
              dispatch({type: "LOGIN", payload: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                userId: jwt_decode<AuthToken>(data.access_token).sub
              }})
          })
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