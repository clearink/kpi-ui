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

const sleep = (delay: number) =>
  new Promise((res) => {
    setTimeout(res, delay)
  })

const schema = k
  .array(
    k.object({
      a: k.number(),
      b: k.number().optional(),
      c: k.object({
        a: k.number(),
      }),
    })
  )
  .min(3)
type A = k.Infer<typeof schema>

schema
  .validate([
    {
      a: +'2',
      c: {
        a: +'1',
      },
    },
  ])
  .then((res) => {
    console.log('schema res', res)
  })
  .catch((err) => {
    console.log('schema err', err)
  })

/** 问题 */
// 0. 定位
// 1. 校验函数怎么定义?
// 2. 使用方法是什么?
// 3. 不阻塞提交时应该如和操作?

/**
 * 0. 定位
 * 这只是一个校验工具
 */
/**
 * 1. 校验支持异步
 */

// k.number()
//   .min(123)
//   // 自定义校验  context = formInstance
//   .refine(async (value, context) => {
//     await sleep(1000)
//     return value <= Math.random() * 4000
//   }, '${path} is not less')

// // form.item
// // const schema = getContext() ||
// // context
// const schema = k.object({
//   username: k.string().min(10).max(30),
//   age: k.number().min(1).max(100),
//   phone: k.string().refine((value) => /\d{11}/.test(value)),
//   email: k.string().email(),
//   aa: k.enums([1, 2, 'a', 'c']),
//   arr: k.array(
//     k.object({
//       id: k.string().uuid(),
//       value: k.string(),
//     })
//   ),
// })
// // 要么全部分散验证。要么集中验证
// // 集中验证=>性能问题
// // 分散验证=>类型不明确了

// type O = k.infer<typeof schema>
// schema
//   .validate({})
//   .then((res) => {
//     console.log('res', res)
//   })
//   .catch((err) => {
//     console.log('err', err)
//   })

// const schema1 = k.number().min(1).range(2, 4)
// type AAA = k.infer<typeof schema1>

// /**
//  * 如果单单是为了校验 undefined，null，undefined | null
//  * 就引入三个 schema 我认为不是很划算
//  * 目前的想法是设定一个标识符，直接判断即可
//  *
//  *
//  * 注意 transform 到底应该该交给谁去处理呢？
//  * 1. 交给form组件
//  *  1.1 组件本身就应该将值转换为合适的类型
//  * 2. 交给 transform 方法
//  *  2.1 数据转换应当在校验时触发，以保证组件的性能。
//  *
//  *  */
// // k.string()
// //   .required()
// //   .refine((value, form) => {
// //     return value === form.getFieldValue('password')
// //   }, '密码不一致')
// // const schema = useEvent((form: FormInstance) => {
// //   return k.object({
// //     // 10 - 20 要不要重置掉 min(2) 呢？
// //     // 很明显 是需要的
// //     username: k.number().min(2).range(10, 20),
// //   })
// // })

// // 被覆盖后的错误信息需要保证正常
// /**
//  * 1. k.number().min(1) => num >= 1 必须大于等于 1
//  * 2. k.number().min(1).range(2, 4) => num在2到4之间
//  * 3. k.number().min(1).range(2, 4).min(-1) => 这时range还有效果吗？
//  *   1. num >= -1 覆盖所有（不合理）
//  *   2. 2 <= num >= 4 && num >= -1 不覆盖 之间新增一条
//  *   3. -1 <= num >= 4  合并（现在的问题是合并后的校验 是拿 2，4 还是 -1， 4）
//  * 4. k.number().min(1).range(2, 4).min(-1).max(2)
//  */
