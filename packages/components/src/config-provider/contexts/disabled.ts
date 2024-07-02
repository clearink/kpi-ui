import { ctxHelper } from '@kpi-ui/utils'

export type DisabledType = false | true | undefined

export const DisabledContext = ctxHelper<DisabledType>(undefined)
