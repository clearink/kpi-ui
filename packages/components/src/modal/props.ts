import type { OverlayProps } from '@comps/_shared/components'
import type { HasChildren, HasClosable, SemanticStyledProps } from '@comps/_shared/types'
import type { ReactElement, ReactNode } from 'react'

export interface ModalProps extends HasChildren, HasClosable,
  SemanticStyledProps<'body' | 'closeBtn' | 'footer' | 'header' | 'main' | 'root'>,
  Pick<
    OverlayProps,
      'getContainer' | 'keepMounted' | 'mask' | 'open' | 'transitions' | 'unmountOnExit' | 'zIndex'
  > {
  children?: ReactNode

  closeOnEscape?: boolean

  footer?: ReactNode

  maskClosable?: boolean

  modalRender?: (modal: ReactElement) => ReactElement

  onCancel?: () => void

  onOk?: () => void

  returnFocus?: boolean

  title?: ReactNode
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultModalProps: Partial<ModalProps> = {
  closeOnEscape: true,
  closable: true,
  mask: true,
  maskClosable: true,
  returnFocus: true,
}
