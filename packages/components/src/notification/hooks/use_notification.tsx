import type { StatusType } from '@comps/_shared/types'
import type { VoidFn } from '@internal/types'
import type { Root } from 'react-dom/client'

import { Portal } from '@comps/_shared/components'
import { presetStatus } from '@comps/_shared/constants'
import { useConstant, useForceUpdate } from '@comps/_shared/hooks'
import { getTargetElement, makeUniqueId, withDefaults } from '@comps/_shared/utils'
import { ownerDocument, pick } from '@internal/utils'
import React, { useMemo } from 'react'
import { createRoot } from 'react-dom/client'

import type { NotificationConfig, NotificationMethods, NotificationProps } from '../props'

import { defaultNotificationConfig } from '../props'

export class NotificationState {
  // 存储通知详情,用于渲染数据
  notices = {
    topLeft: [],
    topRight: [],
    bottomLeft: [],
    bottomRight: [],
  }
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

export function useNotification(_config: NotificationConfig) {
  const config = withDefaults(_config, defaultNotificationConfig)

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

function Wrapper() {
  const [_, holder] = useNotification({})

  return holder
}

export function makeStaticMethods() {
  const _globalConfig = {
    ...defaultNotificationConfig,
  }

  let root: Root | null = null

  const _buildHolder = () => {
    const doc = ownerDocument()

    const holder = doc.createDocumentFragment()

    const container = getTargetElement(null, doc.body)

    container?.appendChild(holder)

    root = createRoot(holder)
  }

  // const root = createRoot(ownerBody())

  const impl = (_type: StatusType) => (_config: NotificationProps) => {
    // const config = withDeepDefaults(_config, globalConfig)

    root?.render(
      <React.StrictMode>
        <Wrapper />
      </React.StrictMode>,
    )
  }

  const staticMethods = presetStatus.reduce((result, type) => {
    result[type] = impl(type)

    return result
  }, {} as NotificationMethods)

  // 怎样才能返回那几个方法呢?
  return staticMethods
}
