import type { SemanticStyledProps } from '@kpi-ui/types'
import type { HTMLAttributes, RefCallback } from 'react'
import type { PortalProps } from '../portal/props'

export interface OverlayProps
  extends SemanticStyledProps<'root' | 'mask'>,
    Pick<PortalProps, 'getContainer'> {
  children: React.ReactElement | ((ref: RefCallback<HTMLDivElement>) => React.ReactElement)

  attrs?: {
    root?: HTMLAttributes<HTMLDivElement>
    mask?: HTMLAttributes<HTMLDivElement>
  }

  mask?: boolean

  open?: boolean

  transitions?: { mask?: string; content?: string }

  keepMounted?: boolean

  unmountOnExit?: boolean

  onBeforeOpen?: () => void

  onOpen?: () => void

  onAfterOpen?: () => void

  onBeforeClose?: () => void

  onClose?: () => void

  onAfterClose?: () => void
}
