import {
  type FormEvent,
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useEffect,
  useMemo,
  Ref,
  ReactElement,
} from 'react'
import { FieldContext, FormContext } from '../../_context'
import { withDefaultProps } from '../../_hocs'
import { useEvent, useMounted } from '../../_hooks'
import { isFunction } from '../../_utils'
import { HOOK_MARK } from '../control/control'
import useForm from '../hooks/use_form'
import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from '../props'

function Form<State = any>(props: FormProps<State>, ref: ForwardedRef<FormInstance>) {
  const {
    name,
    as,
    form,
    children,
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

  const mounted = useMounted()

  // 设置初始值, 仅在挂载前设置一次
  internalHook?.setInitialValues(initialValues, mounted.current)
  // 用于多表单联动
  const parent = FormContext.useState()
  useEffect(() => parent.register(instance, name), [instance, name, parent])

  // 事件处理
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

  const fieldContextValue = useMemo(() => {
    return { ...instance, validateTrigger }
  }, [instance, validateTrigger])

  let NODE = children
  if (isFunction(children)) NODE = children(instance.getFieldsValue(), instance)

  return (
    <Root
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <FieldContext.Provider value={fieldContextValue}>{NODE}</FieldContext.Provider>
    </Root>
  )
}

export default forwardRef<FormInstance, FormProps>(Form) as <State = any>(
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
