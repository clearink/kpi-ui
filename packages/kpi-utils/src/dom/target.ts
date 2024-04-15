import { MayBe } from '@kpi-ui/types'
import { MutableRefObject } from 'react'
import { isFunction, isNullish, isObjectLike, isString } from '../is'
import { ownerDocument } from './global'
import { isBrowser } from './is_browser'

type TargetElement = HTMLElement | Element | Window | Document | false

export type GetTargetElement<T extends TargetElement> =
  | string
  | MayBe<T>
  | (() => MayBe<T>)
  | MutableRefObject<MayBe<T>>

export function getTargetElement<T extends TargetElement>(target: GetTargetElement<T>): MayBe<T>
export function getTargetElement<T extends TargetElement>(
  target: GetTargetElement<T>,
  defaultElement: T
): MayBe<T>
export function getTargetElement<T extends TargetElement>(...args: [GetTargetElement<T>, T?]) {
  const [target, defaultElement] = args

  if (!isBrowser()) return null

  if (isNullish(target)) return defaultElement

  if (isFunction(target)) return target()

  if (isString(target)) return ownerDocument().querySelector(target) as T

  if (isObjectLike(target) && 'current' in target) return target.current

  return target
}
