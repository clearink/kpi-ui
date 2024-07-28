import type { NotificationConfig } from '@comps/notification/props'
import type { VoidFn } from '@internal/types'

import { useConstant, useForceUpdate, useWatchValue } from '@comps/_shared/hooks'
import { useMemo } from 'react'

import type { NotificationListProps } from '../props'

export class NotificationState {
  notices: NotificationConfig[]

  constructor(notice: NotificationListProps['notice']) {
    this.notices = [notice]
  }
}

export class NotificationAction {
  constructor(public forceUpdate: VoidFn, private states: NotificationState) {

  }

  appendNotice = (notice: NotificationConfig) => {
    this.states.notices.push(notice)
  }

  updateNotices = (notices: NotificationState['notices']) => {
    this.states.notices = notices

    this.forceUpdate()
  }
}

export default function useNotificationStore(props: NotificationListProps) {
  const { notice } = props

  const update = useForceUpdate()

  const states = useConstant(() => new NotificationState(notice))

  const actions = useMemo(() => new NotificationAction(update, states), [update, states])

  const returnEarly = useWatchValue(notice, () => {
    actions.appendNotice(notice)

    actions.forceUpdate()

    return true
  })

  return { returnEarly, states, actions }
}
