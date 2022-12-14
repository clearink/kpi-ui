import CtxHelper from './helper'

import type { DisabledType, SizeType } from '../types'
import type { ConfigConsumerProps } from '../../config_provider/props'

export const SizeContext = CtxHelper<SizeType>(undefined)

export const DisabledContext = CtxHelper<DisabledType>(undefined)

export const ConfigContext = CtxHelper<ConfigConsumerProps>({
  prefixCls: 'kpi',
})
