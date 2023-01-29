// row 组件传递数据给 col 组件
import { contextHelper } from '@kpi/shared'

export interface RowContextState {
  gapSupport: boolean
  hGutter: number
  vGutter: number
}
export default contextHelper<RowContextState>({
  gapSupport: false,
  hGutter: 0,
  vGutter: 0,
})
