import type { MayBe } from '@internal/types'
import type { MutableRefObject } from 'react'

import { isBrowser, isFunction, isNullish, isObject, isString, ownerDocument } from '@internal/utils'

type TargetElement = DocumentFragment | Element | false

export type GetTargetElement<T extends TargetElement = TargetElement> =
  | (() => MayBe<T>)
  | MayBe<T>
  | MutableRefObject<MayBe<T>>
  | string

export function getTargetElement<T extends TargetElement>(target: GetTargetElement<T>): MayBe<T>
export function getTargetElement<T extends TargetElement>(
  target: GetTargetElement<T>,
  defaultElement: T,
): MayBe<T>
export function getTargetElement<T extends TargetElement>(...args: [GetTargetElement<T>, T?]) {
  const [target, defaultElement] = args

  if (!isBrowser) return null

  if (isNullish(target)) return defaultElement

  if (isFunction(target)) return target()

  if (isString(target)) return ownerDocument().querySelector(target) as T

  if (isObject(target) && 'current' in target) return target.current

  return target
}
