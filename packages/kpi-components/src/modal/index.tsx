import { withDefaults } from '@kpi-ui/utils'
import Overlay from '../overlay-internal'

import type { ModalProps } from './props'

function Modal(props: ModalProps) {
  return (
    <Overlay
      open={props.open}
      forceRender={props.forceRender}
      destroyOnClose={props.destroyOnClose}
      container={props.container}
      transition="kpi-slide-bottom"
    >
      <div>modal component</div>
    </Overlay>
  )
}

export default withDefaults(Modal)

/**
 * 需要干什么?
 */
