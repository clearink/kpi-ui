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

console.log(k.number().min(10))

/** 问题 */
// 0. 定位
// 1. 校验函数怎么定义?
// 2. 使用方法是什么?
//

/**
 * 0. 定位
 * 这只是一个校验工具
 */
/**
 * 1. 校验支持异步
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

// form.item
// const schema = getContext() ||
// context
const schema = k
  .object({
    username: k.string().min(10).max(30),
    age: k.number().min(1).max(100),
    phone: k.string().refine((value) => /\d{11}/.test(value)),
    email: k.string().email()
  })
  .and(
    k
      .object({
        email: k.string().email(),
      })
      .or(
        k.object({
          email: k.number(),
          phone: k.string().uuid(),
        })
      )
  )
// 要么全部分散验证。要么集中验证
// 集中验证=>性能问题
// 分散验证=>类型不明确了

type O = k.infer<typeof schema>
