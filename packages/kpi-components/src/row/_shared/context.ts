import { ctxHelper } from '@kpi-ui/utils'

// row 组件传递数据给 col 组件
export type RowContextState = number

export const RowContext = ctxHelper<RowContextState>(0)
