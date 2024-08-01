import { usePrefixCls } from '@comps/_shared/hooks'
import { attachDisplayName } from '@comps/_shared/utils'
import { NotificationContext } from '@comps/notification/_shared/context'
import { useMemo } from 'react'

import type { NotificationListProps } from './props'

import NotificationNotice from '../notice'
import useNotificationStore from './hooks/use_notification_store'

function NotificationList(props: NotificationListProps) {
  const { onFinish, type } = props

  const prefixCls = usePrefixCls('notification')

  const { returnEarly, states, actions } = useNotificationStore(props)

  const notificationContext = useMemo(() => ({}), [])

  if (returnEarly) return null

  return (
    <div className={`${prefixCls}-list ${prefixCls}-list--${type}`}>
      <NotificationContext.Provider value={notificationContext}>
        {states.notices.map((item) => {
        // 计算需要偏移的位置
          return (
            <NotificationNotice
              {...item}
              onExited={() => {
                const newNotices = states.notices.filter(e => e.key !== item.key)
                if (newNotices.length)
                  actions.updateNotices(newNotices)
                else
                  onFinish()
              }}
            />
          )
        })}
      </NotificationContext.Provider>
    </div>
  )
}

attachDisplayName(NotificationList)

export default NotificationList
