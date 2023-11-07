// row 组件传递数据给 col 组件
import { ctxHelper } from '../utils'

export type RowContextState = number
const RowContext = ctxHelper<RowContextState>(0)
export default RowContext
