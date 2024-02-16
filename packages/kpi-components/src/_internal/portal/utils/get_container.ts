import { isBrowser, isFunction, isNullish, isString, ownerDocument } from '@kpi-ui/utils'

import type { PortalProps } from '../props'

export default function getContainer(container: PortalProps['getContainer']) {
  if (!isBrowser()) return null

  if (isNullish(container)) return ownerDocument().body

  if (isFunction(container)) return container()

  if (!isString(container)) return container

  return ownerDocument(null).querySelector<HTMLElement>(container)
}
