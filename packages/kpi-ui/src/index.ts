// components
import * as kfc from './_utils/form_schema'

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
export * as kfc from './_utils/form_schema'

const rule = kfc.object({
  username: kfc.string().range(3, 8).uppercase(),
  age: kfc.number(),
  email: kfc.string().email().optional(),
})
type FormValues = kfc.Infer<typeof rule>

rule
  .validate(
    {
      username: 1,
      age: '2',
      email: '2',
    },
    { abortEarly: !true }
  )
  .then((value) => {
    console.log(value)
  })
  .catch((err) => {
    console.log(err)
  })
