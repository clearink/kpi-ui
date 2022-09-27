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
  // 自定义校验  context = formInstance
  .refine(async (value, context) => {
    await sleep(1000)
    return value <= Math.random() * 4000
  }, '${path} is not less')

// form.item
// const schema = getContext() ||
// context
const schema = k.object({
  username: k.string().min(10).max(30),
  age: k.number().min(1).max(100),
  phone: k.string().refine((value) => /\d{11}/.test(value)),
  email: k.string().email(),
  aa: k.enums([1, 2, 'a', 'c']),
  arr: k.array(
    k.object({
      id: k.string().uuid(),
      value: k.string(),
    })
  ),
})
// 要么全部分散验证。要么集中验证
// 集中验证=>性能问题
// 分散验证=>类型不明确了

type O = k.infer<typeof schema>
schema
  .validate({})
  .then((res) => {
    console.log('res', res)
  })
  .catch((err) => {
    console.log('err', err)
  })

const schema1 = k
  .number()
  .required()
  .max(20, '长度不能超过 20 哦！')
  .transform((current, original, context) => 1)
  .transform(async () => {
    await sleep(123)
    return '123'
  })
type AAA = k.infer<typeof schema1>

/**
 * 如果单单是为了校验 undefined，null，undefined | null
 * 就引入三个 schema 我认为不是很划算
 * 目前的想法是设定一个标识符，直接判断即可
 *
 *
 * 注意 transform 到底应该该交给谁去处理呢？
 * 1. 交给form组件
 *  1.1 组件本身就应该将值转换为合适的类型
 * 2. 交给 transform 方法
 *  2.1 数据转换应当在校验时触发，以保证组件的性能。
 *
 *  */
// k.string()
//   .required()
//   .refine((value, form) => {
//     return value === form.getFieldValue('password')
//   }, '密码不一致')
