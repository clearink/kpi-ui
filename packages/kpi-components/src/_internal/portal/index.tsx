// utils
import { getTargetElement, isNullish, ownerBody, withDisplayName } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'
// types
import type { PortalProps, PortalRef } from './props'

export const defaultProps: Partial<PortalProps> = {}

function Portal(props: PortalProps, ref: ForwardedRef<PortalRef>) {
  const { children, getContainer: _container } = props

  const [container, set] = useState(() => getTargetElement(_container, ownerBody()))

  useImperativeHandle(ref, () => ({ container }), [container])

  // prettier-ignore
  useEffect(() => { set(getTargetElement(_container, ownerBody())) }, [_container])

  if (isNullish(container)) return null

  if (container === false) return <>{children}</>

  return createPortal(children, container)
}

export default withDisplayName(forwardRef(Portal))
