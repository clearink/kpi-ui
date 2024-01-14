import { isBrowser, isFunction, isNullish, isString } from '@kpi-ui/utils'

import type { PortalProps } from '../props'

export default function getContainer(container: PortalProps['container']) {
  if (!isBrowser()) return null

  if (isNullish(container)) return document.body

  if (isFunction(container)) return container()

  if (!isString(container)) return container

  return document.querySelector<HTMLElement>(container)
}
