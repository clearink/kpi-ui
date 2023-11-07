// row 组件传递数据给 col 组件
import { ctxHelper } from '../utils'

export interface RowContextState {
  hGutter: number
  vGutter: number
}
export default ctxHelper<RowContextState>({
  hGutter: 0,
  vGutter: 0,
})
