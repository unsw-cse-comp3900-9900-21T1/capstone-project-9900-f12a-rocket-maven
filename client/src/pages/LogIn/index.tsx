 import * as Yup from 'yup'
import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { Space } from '../../componentsStyled/Spacers'
import LoginForm from '../../components/LoginForm'
import RegisterForm from '../../components/RegisterForm'

const LogIn = () => {

  return (
    <Page>
      <Title>
        Login Stub
      </Title>
      <LoginForm/>
      <Space/>
      <RegisterForm/>
    </Page>
  )
}

export default LogIn
