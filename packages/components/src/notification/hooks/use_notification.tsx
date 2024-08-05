import type { VoidFn } from '@internal/types'

import { Portal } from '@comps/_shared/components'
import { useConstant, useForceUpdate } from '@comps/_shared/hooks'
import { makeUniqueId, withDefaults } from '@comps/_shared/utils'
import { ownerBody, pick } from '@internal/utils'
import React, { useMemo } from 'react'

import type { NotificationConfig } from '../props'

import NotificationList from '../components/list'

export class NotificationState {
  topLeftNotices = []

  topRightNotices = []

  bottomLeftNotices = []

  bottomRightNotices = []
}

export class NotificationAction {
  constructor(public forceUpdate: VoidFn, private states: NotificationState) {}

  private uniqueId = makeUniqueId('notification-')

  // 一个holder中需要维持4个不同方向上的portal,
  // 并及时清空内部数据
  // 添加一个通知
  private appendNotice = () => {}

  // base methods
  open = () => {}
  destroy = () => {}
  // status methods
  info = () => { }
  warning = () => { }
  success = () => {}
  error = () => {}
}

const defaultConfig: Partial<NotificationConfig> = {
  top: 24,
  bottom: 24,
  getContainer: () => document.body,
  stack: { threshold: 3 },
  duration: 4.5,
  pauseOnHover: true,
  placement: 'topRight',
  showProgress: false,
}

export function useNotification(_config: NotificationConfig) {
  const config = withDefaults(_config, defaultConfig)

  const { getContainer } = config

  const update = useForceUpdate()

  const states = useConstant(() => new NotificationState())

  const actions = useMemo(() => new NotificationAction(update, states), [update, states])

  const methods = useMemo(() => pick(actions, [
    'open',
    'destroy',
    'info',
    'warning',
    'error',
    'success',
  ]), [actions])

  // 如果使用 useNotification 应该使用 portal 去创建了
  // holder如何创建?
  const holder = (
    <>
      <Portal key="topLeft" getContainer={getContainer}>
        <div>12312</div>
        {/* <NotificationList /> */}
      </Portal>
      <Portal key="topRight" getContainer={getContainer}>
        <div>12312</div>
        {/* <NotificationList /> */}
      </Portal>
      <Portal key="bottomLeft" getContainer={getContainer}>
        <div>12312</div>
        {/* <NotificationList /> */}
      </Portal>
      <Portal key="bottomRight" getContainer={getContainer}>
        <div>12312</div>
        {/* <NotificationList /> */}
      </Portal>
    </>
  )

  return [methods, holder] as const
}

export function makeStaticMethods() {
  const root = createRoot(ownerBody())

  const impl = (type: StatusType) => (_config: NotificationConfig) => {
    const config = withDeepDefaults(_config, defaultConfig)

    root.render(<NotificationList />)
  }

  const staticMethods = presetStatus.reduce((result, type) => {
    result[type] = impl(type)

    return result
  }, {} as NotificationMethods)

  return staticMethods

  // 怎样才能返回那几个方法呢?
}
