 import * as Yup from 'yup'
import { useContext } from 'react'
import Page from '../_Page'
import { Title } from '../../componentsStyled/Typography'
import { Space } from '../../componentsStyled/Layouts'
import LoginForm from '../../components/LoginForm'
import RegisterForm from '../../components/RegisterForm'
import { storeContext } from '../../data/store'

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
