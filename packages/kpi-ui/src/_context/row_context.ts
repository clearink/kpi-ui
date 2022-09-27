// row 组件传递数据给 col 组件
import ctxHelper from './helper'

export interface RowContextState {
  gapSupport: boolean
  hGutter: number
  vGutter: number
}
export default ctxHelper<RowContextState>()
