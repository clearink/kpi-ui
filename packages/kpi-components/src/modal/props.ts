import type React from 'react'
import type { OverlayProps } from '../_internal/overlay/props'

export interface StyledProps {
  className?: string
  style?: React.CSSProperties
}

export interface ModalProps
  extends StyledProps,
    Pick<
      OverlayProps,
      'container' | 'mask' | 'open' | 'transitions' | 'keepMounted' | 'unmountOnExit'
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
