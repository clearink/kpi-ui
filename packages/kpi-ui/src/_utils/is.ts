import { AnyObject } from '../_types'

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
  | 'Promise'

export function rawType(obj: any) {
  return Object.prototype.toString.call(obj)
}

export const validateType = (obj: any, type: ValueType) => rawType(obj) === `[object ${type}]`

export const isNull = (obj: any): obj is null => obj === null

export const isUndefined = (obj: any): obj is undefined => obj === undefined

export const isNullish = (obj: any): obj is null | undefined => isNull(obj) || isUndefined(obj)

export const { isArray } = Array

export const isFunction = (obj: any): obj is (...args: any[]) => any => typeof obj === 'function'

export const isObject = (obj: any): obj is object => validateType(obj, 'Object')

export const isObjectLike = (obj: any): obj is AnyObject => obj !== null && typeof obj === 'object'

export const isNumber = (obj: any): obj is number => validateType(obj, 'Number')

export const isString = (obj: any): obj is string => validateType(obj, 'String')

export const isBoolean = (obj: any): obj is boolean => validateType(obj, 'Boolean')

export const isDate = (obj: any): obj is Date => validateType(obj, 'Date')

export const isSymbol = (obj: any): obj is symbol => validateType(obj, 'Symbol')

export const isPromiseLike = (obj: any): obj is PromiseLike<any> =>
  validateType(obj, 'Promise') ||
  (isObjectLike(obj) && isFunction(obj.then) && isFunction(obj.catch))
