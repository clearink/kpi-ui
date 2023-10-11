/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import { hasOwn } from '@kpi/shared'

export const $prop = Symbol('prop')

export function incFinishProp(el: Element) {
  if (!hasOwn(el, $prop)) el[$prop] = 0

  return (el[$prop] += 1)
}
