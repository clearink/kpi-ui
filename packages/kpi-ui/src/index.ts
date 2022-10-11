// components

import { setIn } from './form/utils'

export { default as Button } from './button'
export { default as Typography } from './typography'
export { default as Divider } from './divider'
export { default as Space } from './space'
export { default as Breadcrumb } from './breadcrumb'
export { default as Row } from './row'
export { default as Col } from './col'
export { default as Pagination } from './pagination'
export { default as BackTop } from './back-top'

// const sleep = (delay: number) =>
//   new Promise((res) => {
//     setTimeout(res, delay)
//   })

// const schema = k.object({
//   a: k.array(
//     k
//       .number()
//       .max(3)
//       .transform((val, ctx) => {
//         console.log(ctx.path)
//         return val * 1000
//       })
//   ),
// })

// type A = k.Infer<typeof schema>
// console.log('start', Date.now())
// schema
//   .validate({ a: [1, 2, 3] })
//   .then((res) => {
//     console.log('res', res, Date.now())
//   })
//   .catch((err) => {
//     console.log('err', Date.now())
//   })
