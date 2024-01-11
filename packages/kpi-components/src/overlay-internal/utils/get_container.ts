import { isFunction, isNullish, isString } from '@kpi-ui/utils'

import type { OverlayProps } from '../props'

export default function getContainer(container: OverlayProps['container']) {
  if (isNullish(container)) return null

  if (isFunction(container)) return container()

  if (!isString(container)) return container

  return document.querySelector<HTMLElement>(container)
}
