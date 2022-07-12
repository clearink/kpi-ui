// row 组件传递数据给 col 组件
import contextHelper from '../_utils/context_helper'

export interface RowContextState {
  gapSupport: boolean
  hGutter: number
  vGutter: number
}
export default contextHelper<RowContextState>()
