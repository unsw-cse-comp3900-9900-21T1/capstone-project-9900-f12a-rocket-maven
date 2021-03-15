import * as Yup from 'yup'

export const stringRequired = Yup.string()
  .max(20, 'Must be 20 Characters or less')
  .required('Required')

export const stringLongRequired = Yup.string()
  .max(50, 'Must be 50 Characters or less')
  .required('Required')
  
export const descriptionTextRequired = Yup.string()
  .max(500, 'Must be 500 Characters or less')
  .required('Required')

export const emailRequired = stringLongRequired.email(
  'Must be a valid email address'
) 

// TODO(Jude): Regex expression for birthday and appropriate warning
// export const birthDayRequired

export const minLengthRequired = (length: number) =>
  stringRequired.min(length, `Must be at least ${length} characters long`)

export const countryRequired = Yup.string()
  .oneOf(
    ['AU', 'US', 'GB'],
    'Invalid Country'
  )
  .required('Required')

export const booleanRequired = Yup.boolean()
  .required('Required')

export const acceptedRequired = booleanRequired
  .oneOf([true], 'You must accept the terms and conditions.')

export const genderRequired = Yup.string()
  .oneOf(
    ['male', 'female', 'none'],
    'Please select one'
  )
  .required('Required')

export const numberRequired = Yup.number()
  .required('Required')
  .positive()

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