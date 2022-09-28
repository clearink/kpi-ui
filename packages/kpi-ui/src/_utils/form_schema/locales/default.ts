// 校验失败声明
/* eslint-disable no-template-curly-in-string */

export const base = {
  required: '${path} is a required field',
  defined: '${path} must be defined',
  notNull: '${path} cannot be null',
}
export const string = {
  min: '${path} must be at least ${min} characters',
  max: '${path} must be at most ${max} characters',
  length: '${path} must be exactly ${length} characters',
  regex: '${path} must match the following: "${regex}"',
  email: '${path} must be a valid email',
  url: '${path} must be a valid URL',
  uuid: '${path} must be a valid UUID',
  // trim 是该直接改变源数据还是别的呢要验证呢？
  trim: '${path} must be a trimmed string',
  lowercase: '${path} must be a lowercase string',
  uppercase: '${path} must be a upper case string',
}
export const number = {
  min: '${path} must be greater than ${min}',
  max: '${path} must be less than ${max}',
  equal: '${path} must be equal to ${equal}',
  positive: '${path} must be a positive number',
  negative: '${path} must be a negative number',
  integer: '${path} must be an integer',
}
