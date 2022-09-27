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
