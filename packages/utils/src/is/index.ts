import type { AnyFn, AnyObj } from '@internal/types'

import { rawType } from '../object'

export const isNull = (obj: any): obj is null => obj === null

export const isUndefined = (obj: any): obj is undefined => obj === undefined

export const isNullish = (obj: any): obj is null | undefined => obj == null

export const { isArray } = Array

export const isFunction = (obj: any): obj is AnyFn => typeof obj === 'function'

export function isObject(obj: any): obj is AnyObj {
  return obj != null && typeof obj === 'object'
}
export const isPlainObject = (obj: any): obj is AnyObj => rawType(obj) === 'Object'

export const isNumber = (obj: any): obj is number => rawType(obj) === 'Number'

export const isString = (obj: any): obj is string => rawType(obj) === 'String'

export const isBoolean = (obj: any): obj is boolean => rawType(obj) === 'Boolean'

export const isDate = (obj: any): obj is Date => rawType(obj) === 'Date'

export const isSymbol = (obj: any): obj is symbol => rawType(obj) === 'Symbol'

export function isPromiseLike(obj: any): obj is PromiseLike<any> {
  return rawType(obj) === 'Promise' || (isObject(obj) && isFunction(obj.then))
}
