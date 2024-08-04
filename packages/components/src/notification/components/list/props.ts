import type { NotificationType } from '@comps/_shared/types'
import type { NotificationConfig } from '@comps/notification/props'
import type { VoidFn } from '@internal/types'

export interface NotificationListProps {
  notice: NotificationConfig
  onFinish: VoidFn
  type: NotificationType
}
