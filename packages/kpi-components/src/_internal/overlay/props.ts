import type { SemanticStyledProps } from '@kpi-ui/types'
import type { HTMLAttributes, RefCallback } from 'react'
import type { PortalProps } from '../portal/props'

export interface OverlayProps
  extends SemanticStyledProps<'root' | 'mask'>,
    Pick<PortalProps, 'getContainer'> {
  children: React.ReactElement | ((ref: RefCallback<HTMLDivElement>) => React.ReactElement)

  mask?: boolean

  open?: boolean

  transitions?: { mask?: string; content?: string }

  keepMounted?: boolean

  unmountOnExit?: boolean

  zIndex?: number

  onBeforeOpen?: () => void

  onOpen?: () => void

  onAfterOpen?: () => void

  onBeforeClose?: () => void

  onClose?: () => void

  onAfterClose?: () => void
}
