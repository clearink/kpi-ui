// types
import type { SemanticStyledProps } from '@kpi-ui/types'
import type React from 'react'
import type { OverlayProps } from '../_internal/overlay/props'

export interface DrawerProps
  extends SemanticStyledProps<'root'>,
    Pick<
      OverlayProps,
      'getContainer' | 'mask' | 'open' | 'transitions' | 'keepMounted' | 'unmountOnExit'
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
