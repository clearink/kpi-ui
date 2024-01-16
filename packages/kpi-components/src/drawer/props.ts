import type React from 'react'
import type { OverlayProps } from '../_internal/overlay/props'

export interface StyledProps {
  className?: string
  style?: React.CSSProperties
}

export interface DrawerProps
  extends StyledProps,
    Pick<
      OverlayProps,
      'container' | 'mask' | 'open' | 'transitions' | 'keepMounted' | 'unmountOnExit'
    > {
  children?: React.ReactNode

  title?: React.ReactNode

  footer?: React.ReactNode

  beforeClose?: () => void

  afterClose?: () => void

  beforeOpen?: () => void

  afterOpen?: () => void

  onOpenChange?: (open: boolean) => void
}
