// 校验失败声明
export const base = {
  invalid: '${path} is invalid',
  // required: '{#path} is a required field',
  // defined: '{#path} must be defined',
  // notNull: '{#path} cannot be null',
}

export const string = {
  invalid: '{#path} must be a string',
  min: '{#path} must be at least {#min} characters',
  max: '{#path} must be at most {#max} characters',
  length: '{#path} must be exactly {#length} characters',
  regex: '{#path} must match the following: "{#regex}"',
  email: '{#path} must be a valid email',
  url: '{#path} must be a valid URL',
  uuid: '{path} must be a valid UUID',
  // trim 是该直接改变源数据还是别的呢要验证呢？
  trim: '{path} must be a trimmed string',
  lowercase: '{path} must be a lowercase string',
  uppercase: '{path} must be a upper case string',
}

export const number = {
  invalid: '{#path} must be a number',
  min: '{#path} must be greater than {#min}',
  max: '{#path} must be less than {#max}',
  equal: '{#path} must be equal to {#equal}',
  range: '{#path} be between {#min} and {#max}',
  positive: '{#path} must be a positive number',
  negative: '{#path} must be a negative number',
  integer: '{#path} must be an integer',
}

export const boolean = {
  invalid: '{#path} must be a boolean',
  true: '{#path} field must be true',
  false: '{#path} field must be false',
}

export const date = {
  invalid: '{#path} must be a date',
  min: '{#path} field must be later than {#min}',
  max: '{#path} field must be at earlier than {#max}',
}

export const object = {
  invalid: '{#path} must be a object',
  unknown: '{#path} field has unspecified keys: {#unknown}',
}

export const array = {
  invalid: '{#path} must be a array',
  min: '{#path} field must have at least {#min} items',
  max: '{#path} field must have less than or equal to {#max} items',
  length: '{#path} must have {#length} items',
  nonempty: '{#path} must have at least one items',
}

export const enums = {
  invalid: '{#path} must be include {#enums}',
}
