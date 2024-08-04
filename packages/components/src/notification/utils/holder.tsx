import type { NotificationPlacement } from '@comps/_shared/types'

import { getTargetElement } from '@comps/_shared/utils'
import { ownerDocument } from '@internal/utils'
import { createRoot } from 'react-dom/client'

import type { NotificationConfig } from '../props'

function createHolder(getContainer: NotificationConfig['getContainer']) {
  const doc = ownerDocument()

  const container = getTargetElement(getContainer, doc.body)

  if (!container)
    throw new Error('getContainer is not existed')

  const div = doc.createElement('div')

  const root = createRoot(container.appendChild(div))

  const unmount = () => {
    root.unmount()
    container.removeChild(div)
  }

  const notices: NotificationConfig[] = []

  return { root, unmount, notices }
}

export function buildHolder() {
  const cache: Partial<Record<NotificationPlacement, ReturnType<typeof createHolder>>> = {}

  return function getInstance(config: NotificationConfig) {
    const { placement, getContainer } = config

    if (!cache[placement!])
      cache[placement!] = createHolder(getContainer)

    const { root, unmount, notices } = cache[placement!]!

    const destroy = () => {
      unmount()
      delete cache[placement!]
    }

    return { root, destroy, notices }
  }
}
