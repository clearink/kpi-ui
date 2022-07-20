// components
import * as k from './_utils/form_schema'

export { default as Button } from './button'
export { default as Typography } from './typography'
export { default as Divider } from './divider'
export { default as Space } from './space'
export { default as Breadcrumb } from './breadcrumb'
export { default as Row } from './row'
export { default as Col } from './col'
export { default as Pagination } from './pagination'

// eslint-disable-next-line no-template-curly-in-string
const s = k.string().required() // .min(2, '长度等于${len}')
const n = k.number().equal(123)
const o = k.object({
  a: k.string().min(2).required(),
  aa: k.string().min(2),
  aaa: k.string().min(2).required(),
})

type A = k.infer<typeof o>
// console.log(s)
/* eslint-disable no-new-wrappers */
n.validate(23)
  .then((r) => {
    console.log('r', r)
  })
  .catch((e) => {
    console.log('e', e)
  })
