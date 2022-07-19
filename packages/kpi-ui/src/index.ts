// components
import k from './_utils/form_schema'

export { default as Button } from './button'
export { default as Typography } from './typography'
export { default as Divider } from './divider'
export { default as Space } from './space'
export { default as Breadcrumb } from './breadcrumb'
export { default as Row } from './row'
export { default as Col } from './col'
export { default as Pagination } from './pagination'

// eslint-disable-next-line no-template-curly-in-string
const s = k.string().min(2, '长度不小于${min}').optional()

type A = typeof s._type
// console.log(s)
/* eslint-disable no-new-wrappers */
s.validate()
  .then((r) => {
    console.log('r', r)
  })
  .catch((e) => {
    console.log('e', e)
  })
