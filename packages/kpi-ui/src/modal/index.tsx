import { createPortal } from 'react-dom'
import { withDefaults } from '@kpi/internal'

import type { ModalProps } from './props'

function Modal(props: ModalProps) {
  const { open } = props
  const className = ''
  const element = <div className={className}>modal component</div>
  const protal = createPortal(element, document.body)
  return protal
}

export default withDefaults(Modal, {
  open: false,
} as const)
