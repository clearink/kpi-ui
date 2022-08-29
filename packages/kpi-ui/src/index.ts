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
export { default as BackTop } from './back-top'

const schema = k.object({
  name: k.string().max(100),
  age: k.number().range(10, 100),
  email: k.string().email().optional(),
  phone: k.string().uuid().optional(),
  someType: k.enums(['a', 'b', 1, 2, 32, true]),
})

type O = k.infer<typeof schema>

console.log(k.number().min(10))

/** 问题 */
// 1. 校验函数怎么定义?
// 2. 使用方法是什么?

/**
 * 1. 支持异步校验
 */
const sleep = (delay: number) =>
  new Promise((res) => {
    setTimeout(res, delay)
  })
k.number()
  .min(123)
  // 自定义校验
  .test(async (value, context) => {
    await sleep(1000)
    return value <= Math.random() * 4000
  }, '${path} is not less')
