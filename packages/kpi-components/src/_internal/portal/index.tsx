import { isNullish, withDefaults } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import getContainer from './utils/get_container'

import type { ContainerType, PortalProps } from './props'

function Portal(props: PortalProps) {
  const { children, container: _container } = props

  const [container, setContainer] = useState<ContainerType>(() => getContainer(_container))

  useEffect(() => {
    setContainer(getContainer(_container))
  }, [_container])

  if (isNullish(container)) return null

  return container === false ? children : createPortal(children, container)
}

export default withDefaults(Portal)
