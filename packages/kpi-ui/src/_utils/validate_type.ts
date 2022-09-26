type ValueType =
  | 'Object'
  | 'Undefined'
  | 'Null'
  | 'Number'
  | 'String'
  | 'Boolean'
  | 'Date'
  | 'Symbol'
  | 'BigInt'
  | 'Map'

export function rawType(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

export const validateType = (obj: any, type: ValueType) => rawType(obj) === type

export const isNull = (obj: any): obj is null => obj === null

export const isUndefined = (obj: any): obj is undefined => obj === undefined

export const isNullish = (obj: any): obj is null | undefined => isNull(obj) || isUndefined(obj)

export const { isArray } = Array

export const isFunction = (obj: any): obj is (...args: any[]) => any => typeof obj === 'function'

export const isObject = (obj: any): obj is object => validateType(obj, 'Object')

export const isObjectLike = (obj: any): obj is object => obj !== null && typeof obj === 'object'

export const isNumber = (obj: any): obj is number => validateType(obj, 'Number')

export const isString = (obj: any): obj is string => validateType(obj, 'String')

export const isBoolean = (obj: any): obj is boolean => validateType(obj, 'Boolean')
