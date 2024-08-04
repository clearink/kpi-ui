import type { NotificationType } from '@comps/_shared/types'

import { PresetNotificationType } from '@comps/_shared/constants/status'
import { makeUniqueId, withDefaults } from '@comps/_shared/utils'
import React from 'react'

import type { NotificationConfig, NotificationMethods } from '../props'

import NotificationList from '../components/list'
import { buildHolder } from './holder'

export default function makeStaticMethods() {
  const getHolder = buildHolder()

  const uniqueId = makeUniqueId('notice-')

  const defaultConfig: Partial<NotificationConfig> = {
    placement: 'topRight',
  }

  const impl = (type: NotificationType) => (_config: NotificationConfig) => {
    const config = withDefaults(_config, {
      ...defaultConfig,
      key: uniqueId(),
    })

    const { root, destroy } = getHolder(config)

    root.render(
      <React.StrictMode>
        <NotificationList notice={config} onFinish={destroy} type={type} />
      </React.StrictMode>,
    )
  }

  const notificationMethods = PresetNotificationType.reduce((result, type) => {
    result[type] = impl(type)

    return result
  }, {} as NotificationMethods)

  return notificationMethods
}
