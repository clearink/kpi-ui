import {
  FormEvent,
  ForwardedRef,
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react'
import { FormContext } from '../_context'
import { useEvent } from '../_hooks'
import { isFunction } from '../_utils'
import useForm from './hooks/use_form'
import { FormInstance, FormProps } from './props'

import * as k from '../_utils/form_schema'

function Form(props: FormProps, ref: ForwardedRef<FormInstance>) {
  const { name, as, form, children, onFinish, onFailed, onReset } = props

  const instance = useForm(form)

  // 表单注册事件
  const parent = FormContext.useState()
  useEffect(() => parent.register(instance, name), [instance, name, parent])

  useImperativeHandle(ref, () => instance)

  const handleSubmit = useEvent((e: FormEvent) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    instance.submit(onFinish, onFailed)
  })
  const handleReset = useEvent((e: FormEvent) => {
    e?.preventDefault?.()
    instance.resetFields()
    onReset?.(e)
  })

  const Root = useMemo(() => {
    if (as) return as
    return as === null ? Fragment : 'form'
  }, [as])

  let NODE = children
  if (isFunction(children)) NODE = children(instance.state, instance)

  return (
    <Root
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {NODE}
    </Root>
  )
}

export default forwardRef<FormInstance, FormProps>(Form)

// Form 的初步使用方式
function App() {
  const schema = useMemo(() => {
    return k.object({
      name: k.number().range(10, 20),
      // 以 name 字段去匹配 schema
      age: k.string().email(),
    })
  }, [])
  const schema1 = useEvent((form: FormInstance) => {
    return k.object({
      name: k.number().range(10, 20),
      // 以 name 字段去匹配 schema
      age: k.string().email(),
    })
  }, [])
  return (
    // schema 自身也可以传入一个函数用于获取 formInstance
    <Form schema={schema}>
      <Form.Item name="name">
        <Input />
      </Form.Item>
      <Form.Item name="age">
        <InputNumber />
      </Form.Item>
      <Form.Item name={['some', 1]}>
        <InputNumber />
      </Form.Item>
      {/* 字段本身的校验可以覆盖顶层 */}
      {/* rule 自身也可以传入一个函数用于获取 formInstance */}
      <Form.Item
        name={['some', 2]}
        rule={k.string().email()}
      >
        <InputNumber />
      </Form.Item>
    </Form>
  )
}
