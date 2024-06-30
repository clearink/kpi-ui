import { ctxHelper } from '@kpi-ui/utils'

export type DisabledType = true | false | undefined

export const DisabledContext = ctxHelper<DisabledType>(undefined)
