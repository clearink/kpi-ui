import type { StatusType } from '@comps/_shared/types'

import { presetStatus } from '@comps/_shared/constants/status'
import { makeUniqueId, withDeepDefaults, withDefaults } from '@comps/_shared/utils'
import { ownerBody } from '@internal/utils'
import React from 'react'
import { createRoot } from 'react-dom/client'

import type { NotificationConfig, NotificationMethods } from '../props'

import NotificationList from '../components/list'
import useNotification from '../hooks/use_notification'
import { buildHolder } from './holder'

const defaultConfig: Partial<NotificationConfig> = {
  top: 24,
  bottom: 24,
  duration: 4.5,
  placement: 'topRight',
  showProgress: false,
  pauseOnHover: true,
  stack: { threshold: 3 },
}

export default function makeStaticMethods() {
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
