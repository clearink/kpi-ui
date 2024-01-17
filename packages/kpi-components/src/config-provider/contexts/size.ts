import { ctxHelper } from '@kpi-ui/utils'

export type SizeType = 'small' | 'default' | 'large' | undefined

export const SizeContext = ctxHelper<SizeType>('default')
