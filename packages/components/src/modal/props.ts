
import type { OverlayProps } from '_shared/components'
import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { ReactElement, ReactNode } from 'react'

export interface ModalProps
  extends HasChildren,
    SemanticStyledProps<'root' | 'main' | 'close' | 'header' | 'body' | 'footer'>,
    Pick<
      OverlayProps,
      'getContainer' | 'mask' | 'open' | 'transitions' | 'keepMounted' | 'unmountOnExit' | 'zIndex'
    > {
  closeOnEscape?: boolean

  children?: ReactNode

  title?: ReactNode

  footer?: ReactNode

  maskClosable?: boolean

  returnFocus?: boolean

  onOk?: () => void

  onCancel?: () => void

  modalRender?: (modal: ReactElement) => ReactElement
}
