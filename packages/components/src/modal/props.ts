import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '_shared/components'
import type { ReactElement, ReactNode } from 'react'

export interface ModalProps
  extends HasChildren,
  SemanticStyledProps<'body' | 'close' | 'footer' | 'header' | 'main' | 'root'>,
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
