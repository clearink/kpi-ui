import { createPortal } from 'react-dom'
import { withDefaultProps } from '@kpi/internal'

import type { ModalProps } from './props'
import Zoom from '../animation/zoom'

function Modal(props: ModalProps) {
  const { open } = props
  const className = ''
  const element = (
    <Zoom open={open} timeout={300}>
      <div className={className}>modal component</div>
    </Zoom>
  )
  const protal = createPortal(element, document.body)
  return protal
}

export default withDefaultProps(Modal, {
  open: false,
} as const)
