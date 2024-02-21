// utils
import { isNullish, withDisplayName } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import getContainer from './utils/get_container'

import type { ContainerType, PortalProps } from './props'

export const defaultProps: Partial<PortalProps> = {}

function Portal(props: PortalProps) {
  const { children, getContainer: _container } = props

  const [container, setContainer] = useState<ContainerType>(null)

  useEffect(() => {
    setContainer(getContainer(_container))
  }, [_container])

  if (isNullish(container)) return null

  if (container === false) return <>{children}</>

  return createPortal(children, container)
}

export default withDisplayName(Portal)
