import { ctxHelper } from '@kpi-ui/internal'

import type { ConfigConsumerProps } from '../../config-provider/props'
import type { SizeType, DisabledType } from '../../types'

export const SizeContext = ctxHelper<SizeType>(undefined)

export const DisabledContext = ctxHelper<DisabledType>(undefined)

export const ConfigContext = ctxHelper<ConfigConsumerProps>({
  prefixCls: 'kpi',
})
