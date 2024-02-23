// types
import type { SemanticStyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'
import type { OverlayProps } from '../_internal/overlay/props'

export interface DrawerProps
  extends SemanticStyledProps<'root' | 'main' | 'close' | 'header' | 'body' | 'footer'>,
    Pick<
      OverlayProps,
      'getContainer' | 'mask' | 'open' | 'transitions' | 'keepMounted' | 'unmountOnExit'
    > {
  closeOnEscape?: boolean

  children?: ReactNode

  title?: ReactNode

  footer?: ReactNode

  beforeClose?: () => void

  afterClose?: () => void

  beforeOpen?: () => void

  afterOpen?: () => void

  onOpenChange?: (open: boolean) => void
}
