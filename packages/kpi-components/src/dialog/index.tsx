import { withDefaults } from '@kpi-ui/utils'
import { createPortal } from 'react-dom'
import { CSSTransition } from '../transition'

import type { ModalProps } from './props'

function Modal(props: ModalProps) {
  const element = (
    <CSSTransition appear when={props.open} name="kpi-dialog-motion">
      <div>modal component</div>
    </CSSTransition>
  )
  return createPortal(element, document.body)
}

export default withDefaults(Modal, {
  open: false,
})

/**
 * 需要干什么?
 */
