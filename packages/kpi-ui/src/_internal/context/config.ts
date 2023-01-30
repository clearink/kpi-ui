import { ctxHelper } from '@kpi/internal'

import type { ConfigConsumerProps } from '../../config_provider/props'
import type { SizeType, DisabledType } from '../../types'

export const SizeContext = ctxHelper<SizeType>(undefined)

export const DisabledContext = ctxHelper<DisabledType>(undefined)

export const ConfigContext = ctxHelper<ConfigConsumerProps>({
  prefixCls: 'kpi',
})
