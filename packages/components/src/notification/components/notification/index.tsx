import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { forwardRef } from 'react'

import { type NotificationProps, defaultNotificationProps } from '../../props'

function _Notification(_props: NotificationProps, ref: any) {
  const __props = withDefaults(_props, defaultNotificationProps)

  return <div ref={ref}>132</div>
}

attachDisplayName(_Notification)

const Notification = forwardRef(_Notification)

export default Notification
