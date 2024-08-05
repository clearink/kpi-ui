import type { OverlayProps } from '@comps/_shared/components'
import type { SemanticStyledProps } from '@comps/_shared/types'
import type { ReactNode } from 'react'

export interface DrawerProps
  extends SemanticStyledProps<'body' | 'close' | 'footer' | 'header' | 'main' | 'root'>,
  Pick<
    OverlayProps,
      'getContainer' | 'keepMounted' | 'mask' | 'open' | 'transitions' | 'unmountOnExit'
  > {
  afterClose?: () => void

  afterOpen?: () => void

  beforeClose?: () => void

  beforeOpen?: () => void

  children?: ReactNode

  closeOnEscape?: boolean

  footer?: ReactNode

  onOpenChange?: (open: boolean) => void

  title?: ReactNode
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultDrawerProps: Partial<DrawerProps> = {
  closeOnEscape: true,
}
