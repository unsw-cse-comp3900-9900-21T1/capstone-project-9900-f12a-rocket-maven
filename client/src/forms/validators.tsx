import * as Yup from 'yup'

export const stringRequired = Yup.string()
  .max(20, 'Must be 20 Characters or less')
  .required('Required')

export const emailRequired = stringRequired.email(
  'Must be a valid email address'
) 

export const minLengthRequired = (length: number) =>
  stringRequired.min(length, `Must be at least ${length} characters long`)

export const countryRequired = Yup.string()
  .oneOf(
    ['AU', 'US', 'GB', 'XX'],
    'Invalid Country'
  )
  .required('Required')

export const acceptedRequired = Yup.boolean()
  .required('Required')
  .oneOf([true], 'You must accept the terms and conditions.')


export const genderRequired = Yup.string()
  .oneOf(
    ['male', 'female', 'none'],
    'Please select one'
  )
  .required('Required')

// TODO(Jude): Issue with typing of test functions - fix!!
// export const password = minLengthRequired(8)
//   .test("no whitespace", "Must contain non-empty characters", v =>
//     !/\s/.test(v),
//   )
//   .test("needs numbers", "Must contain at least 1 number", v =>
//     /\d/.test(v),
//   )
//   .test("needs letters", "Must contain at least 1 letter", v =>
//     /[a-z]/i.test(v),
//   )