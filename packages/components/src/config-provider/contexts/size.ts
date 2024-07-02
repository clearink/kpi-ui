import { ctxHelper } from '@kpi-ui/utils'

export type SizeType = 'large' | 'middle' | 'small' | undefined

export const SizeContext = ctxHelper<SizeType>(undefined)
