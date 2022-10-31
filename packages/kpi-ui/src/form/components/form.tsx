import {
  type FormEvent,
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
  Ref,
  ReactElement,
} from 'react'
import { FieldContext, FormContext } from '../../_context'
import { withDefaultProps } from '../../_hocs'
import { useConstructor, useEvent, useIsomorphicEffect } from '../../_hooks'
import { isFunction } from '../../_utils'
import { HOOK_MARK } from '../control'
import useForm from '../hooks/use_form'
import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from '../props'

function Form<State = any>(props: FormProps<State>, ref: ForwardedRef<FormInstance>) {
  const {
    name,
    as,
    form,
    children: $children,
    onFinish,
    onFailed,
    onReset,
    preserve,
    initialValues,
    validateTrigger,
  } = props

  const instance = useForm(form) as InternalFormInstance // form 实例
  useImperativeHandle(ref, () => instance)

  const internalHook = useMemo(() => instance.getInternalHooks(HOOK_MARK), [instance])

  internalHook?.setPreserve(preserve)
  // 如果form是 render props 不要主动更新视图
  internalHook?.setFormName(name) // 同步formName

  // 设置初始值, 仅在挂载前设置一次
  useConstructor(() => internalHook?.setInitialValues(initialValues))

  // 用于多表单联动
  const parent = FormContext.useState()
  useIsomorphicEffect(() => parent.register(instance, name), [instance, name, parent])

  // 事件处理
  const handleSubmit = useEvent((e?: FormEvent) => {
    isFunction(e?.preventDefault) && e?.preventDefault()
    isFunction(e?.stopPropagation) && e?.stopPropagation()
    instance.submitForm(onFinish, onFailed)
  })

  const handleReset = useEvent((e: FormEvent) => {
    isFunction(e?.preventDefault) && e?.preventDefault()
    isFunction(e?.stopPropagation) && e?.stopPropagation()

    instance.resetFields()

    onReset?.(e)
  })

  const Root = useMemo(() => {
    if (as) return as
    return as === null ? Fragment : 'form'
  }, [as])

  const fieldContext = useMemo(() => {
    return { ...instance, validateTrigger, formName: name }
  }, [instance, validateTrigger, name])

  const children = useMemo(() => {
    if (!isFunction($children)) return $children
    return $children(instance.getFieldsValue(), instance)
  }, [$children, instance])

  return (
    <Root
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <FieldContext.Provider value={fieldContext}>{children}</FieldContext.Provider>
    </Root>
  )
}

export default withDefaultProps(forwardRef<FormInstance, FormProps>(Form), {
  preserve: true,
  validateTrigger: 'onChange',
} as const) as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement

// // Form 的初步使用方式
// function App() {
//   const schema = useMemo(() => {
//     return k.object({
//       name: k.number().range(10, 20),
//       // 以 name 字段去匹配 schema
//       age: k.string().email(),
//     })
//   }, [])
//   const schema1 = useEvent((form: FormInstance) => {
//     return k.object({
//       name: k.number().range(10, 20),
//       // 以 name 字段去匹配 schema
//       age: k.string().email(),
//     })
//   }, [])
//   return (
//     // schema 自身也可以传入一个函数用于获取 formInstance
//     <Form schema={schema}>
//       <Form.Item name="name">
//         <Input />
//       </Form.Item>
//       <Form.Item name="age">
//         <InputNumber />
//       </Form.Item>
//       <Form.Item name={['some', 1]}>
//         <InputNumber />
//       </Form.Item>
//       {/* 字段本身的校验可以覆盖顶层 */}
//       {/* rule 自身也可以传入一个函数用于获取 formInstance */}
//       <Form.Item
//         name={['some', 2]}
//         rule={k.string().email()}
//       >
//         <InputNumber />
//       </Form.Item>
//     </Form>
//   )
// }
