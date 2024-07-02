import { rawType } from '../object'

export const isNull = (obj: any): obj is null => obj === null

export const isUndefined = (obj: any): obj is undefined => obj === undefined

export const isNullish = (obj: any): obj is null | undefined => obj == null

export const { isArray } = Array

export const isFunction = (obj: any): obj is (...args: any[]) => any => typeof obj === 'function'

export const isObject = (obj: any): obj is object => rawType(obj) === 'Object'

export function isObjectLike(obj: any): obj is Record<string, any> {
  return obj != null && typeof obj === 'object'
}

export const isNumber = (obj: any): obj is number => rawType(obj) === 'Number'

export const isString = (obj: any): obj is string => rawType(obj) === 'String'

export const isBoolean = (obj: any): obj is boolean => rawType(obj) === 'Boolean'

export const isDate = (obj: any): obj is Date => rawType(obj) === 'Date'

export const isSymbol = (obj: any): obj is symbol => rawType(obj) === 'Symbol'

export function isPromiseLike(obj: any): obj is PromiseLike<any> {
  return rawType(obj) === 'Promise' || (isObjectLike(obj) && isFunction(obj.then))
}
