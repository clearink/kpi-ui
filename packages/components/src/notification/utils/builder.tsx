import type { NoticeType } from '@comps/_shared/types'

import { PresetStatus } from '@comps/_shared/constants/status'
import { makeUniqueId, withDefaults } from '@comps/_shared/utils'
import React from 'react'

import type { NotificationConfig, StaticNoticeUtils } from '../props'

import NotificationList from '../components/list'
import { buildHolder } from './holder'

export default function builderNoticeUtils() {
  const getHolder = buildHolder()

  const uniqueId = makeUniqueId('notice-')

  const defaultConfig: Partial<NotificationConfig> = {
    placement: 'topRight',
  }

  const impl = (type: NoticeType) => (_config: NotificationConfig) => {
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

  return PresetStatus.reduce((result, type) => {
    result[type] = impl(type)

    return result
  }, {} as StaticNoticeUtils)
}
