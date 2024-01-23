// types
import type { SemanticStyledProps } from '@kpi-ui/types'
import type React from 'react'
import type { OverlayProps } from '../_internal/overlay/props'

export interface ModalProps
  extends SemanticStyledProps<'root'>,
    Pick<
      OverlayProps,
      'getContainer' | 'mask' | 'open' | 'transitions' | 'keepMounted' | 'unmountOnExit'
    > {
  children?: React.ReactNode

  title?: React.ReactNode

  footer?: React.ReactNode

  beforeOpen?: () => void

  onOpen?: () => void

  afterOpen?: () => void

  beforeClose?: () => void

  onClose?: () => void

  afterClose?: () => void

  onOpenChange?: (open: boolean) => void
}
