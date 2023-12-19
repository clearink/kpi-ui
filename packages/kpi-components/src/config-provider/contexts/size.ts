import { ctxHelper } from '@kpi-ui/utils'

export type SizeType = 'small' | 'middle' | 'large' | undefined | number

export const SizeContext = ctxHelper<SizeType>(undefined)
