import type { SemanticStyledProps } from '@kpi-ui/types'
import type { PortalProps } from '../portal/props'
import type { HTMLAttributes } from 'react'

export interface OverlayProps
  extends SemanticStyledProps<'root' | 'mask' | 'wrap'>,
    Pick<PortalProps, 'getContainer'> {
  children: React.ReactElement

  attrs?: {
    root?: HTMLAttributes<HTMLDivElement>
    mask?: HTMLAttributes<HTMLDivElement>
    wrap?: HTMLAttributes<HTMLDivElement>
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
