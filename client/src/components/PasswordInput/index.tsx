import { Form, Input } from 'antd'

function ValidationError(message: string) {
  return Promise.reject(new Error(message))
}

const special_chars = '~`!@#$%^&*()_+-=[]\\{}|:";\'<>?,./'.split('')

const PasswordInput = () => {
  return (
    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input a password!'
        },
        () => ({
          validator(_, value) {
            if (!value) return ValidationError('Cannot have an empty password')

            if (value.length < 12)
              return ValidationError('Password cannot be less than 12 characters')

            if (!/[A-Z]/.test(value))
              return ValidationError('Password must contain at least one capital letter')

            if (!/[a-z]/.test(value))
              return ValidationError('Password must contain at least one lowercase letter')

            /*
            if (!/[0-9]/.test(value))
              return ValidationError('Password must contain at least one digit')

            if (!value.split('').some((ai: string) => special_chars.includes(ai)))
              return ValidationError('Password must contain at least one special character')
            */

            return Promise.resolve()
          }
        })
      ]}
    >
      <Input.Password />
    </Form.Item>
  )
}

export default PasswordInput
