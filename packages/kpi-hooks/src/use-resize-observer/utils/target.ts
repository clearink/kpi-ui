import { isBrowser, isFunction, isNullish, isString, ownerDocument } from '@kpi-ui/utils'

import type { GetTargetType } from '../props'

export default function getObserveTarget(target: GetTargetType) {
  if (!isBrowser() || isNullish(target)) return null

  if (isFunction(target)) return target()

  if (!isString(target)) return target

  return ownerDocument(null).querySelector<HTMLElement>(target)
}
