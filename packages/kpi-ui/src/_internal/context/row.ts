// row 组件传递数据给 col 组件
import { ctxHelper } from '@kpi/internal'

export interface RowContextState {
  hGutter: number
  vGutter: number
}
export default ctxHelper<RowContextState>({
  hGutter: 0,
  vGutter: 0,
})
