import { contextHelper } from '@kpi/shared'
import type { DisabledType, SizeType } from '@kpi/shared'

import type { ConfigConsumerProps } from '../../config_provider/props'

export const SizeContext = contextHelper<SizeType>(undefined)

export const DisabledContext = contextHelper<DisabledType>(undefined)

export const ConfigContext = contextHelper<ConfigConsumerProps>({
  prefixCls: 'kpi',
})
