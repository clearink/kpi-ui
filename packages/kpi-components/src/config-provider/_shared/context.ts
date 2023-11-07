import { ctxHelper } from '@kpi-ui/utils'

import type { ConfigConsumerProps } from '../props'
import type { SizeType, DisabledType } from '../../types'

export const SizeContext = ctxHelper<SizeType>(undefined)

export const DisabledContext = ctxHelper<DisabledType>(undefined)

export const ConfigContext = ctxHelper<ConfigConsumerProps>({
  prefixCls: 'kpi',
})
