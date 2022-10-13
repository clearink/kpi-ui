// components

import * as k from './_utils/form_schema'
import { NullableSchema, OptionalSchema } from './_utils/form_schema/schema'

export { default as Button } from './button'
export { default as Typography } from './typography'
export { default as Divider } from './divider'
export { default as Space } from './space'
export { default as Breadcrumb } from './breadcrumb'
export { default as Row } from './row'
export { default as Col } from './col'
export { default as Pagination } from './pagination'
export { default as BackTop } from './back-top'
export { default as Form } from './form'

const schema = k.number().optional().nullable().unwrap().unwrap()
if (!(schema instanceof NullableSchema) && !(schema instanceof OptionalSchema)) {
  // 视为 必填
}
console.log(schema instanceof NullableSchema, schema instanceof OptionalSchema)
