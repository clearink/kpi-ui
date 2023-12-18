import { ctxHelper } from '@kpi-ui/utils'

import type { ConfigConsumerProps, DisabledType, SizeType, TouchEffectContextState } from '../props'

export const SizeContext = ctxHelper<SizeType>(undefined)

export const DisabledContext = ctxHelper<DisabledType>(undefined)

export const ConfigContext = ctxHelper<ConfigConsumerProps>({
  prefixCls: 'kpi',
})

export const TouchEffectContext = ctxHelper<TouchEffectContextState>({})
