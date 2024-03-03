import type { SemanticStyledProps } from '@kpi-ui/types'
import type { RefCallback } from 'react'
import type { PortalProps, PortalRef } from '../portal/props'
import type { CSSTransitionProps } from '../transition/_shared/props'

export interface OverlayRef {
  container: PortalRef['container']
}

export interface OverlayProps
  extends SemanticStyledProps<'root' | 'mask'>,
    Pick<PortalProps, 'getContainer'>,
    Pick<
      CSSTransitionProps,
      'onEnter' | 'onEntering' | 'onEntered' | 'onExit' | 'onExiting' | 'onExited'
    > {
  children: React.ReactElement | ((ref: RefCallback<HTMLDivElement>) => React.ReactElement)

  mask?: boolean

  open?: boolean

  transitions?: { mask?: string; content?: string }

  keepMounted?: boolean

  unmountOnExit?: boolean

  zIndex?: number
}
