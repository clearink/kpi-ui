import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { forwardRef } from 'react'

import type { NotificationProps } from '../../props'

const defaultProps: Partial<NotificationProps> = {
  duration: 4.5,
  placement: 'topRight',
  showProgress: false,
  pauseOnHover: true,
}

function _Notification(_props: NotificationProps, ref: any) {
  const props = withDefaults(_props, defaultProps)

  return <div ref={ref}>132</div>
}

attachDisplayName(_Notification)

const Notification = forwardRef(_Notification)

export default Notification
