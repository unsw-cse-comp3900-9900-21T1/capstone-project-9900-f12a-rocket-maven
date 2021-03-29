import { Form, Input } from 'antd'

const DateOfBirthInput = () => {
  return (
    /*<DatePicker
            format="YYYY-MM-DD"
            />*/
    <Form.Item
      label="Date of Birth"
      name="date_of_birth"
      initialValue=""
      rules={[
        {
          required: false
        },
        () => ({
          validator(_, value) {
            if (!value || value.length == 0 || /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(value)) {
              return Promise.resolve()
            }
            // Maybe add better date processing?
            return Promise.reject(
              new Error('Please make sure the date is of the format XXXX-XX-XX')
            )
          }
        })
      ]}
    >
      <Input />
    </Form.Item>
  )
}

export default DateOfBirthInput
