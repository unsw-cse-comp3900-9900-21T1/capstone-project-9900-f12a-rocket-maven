import { useField } from 'formik'
import { Error } from '../componentsStyled/Typography'

// Copy and pasted code from official formik tutorials
// TODO(Jude): Make code more specific for our use case

export const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props)
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      <Error>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </Error>
    </div>
  )
}

export const MyCheckbox = ({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' })
  return (
    <div>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      <Error>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </Error>
    </div>
  )
}

export const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      <Error>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </Error>
    </div>
  )
}
