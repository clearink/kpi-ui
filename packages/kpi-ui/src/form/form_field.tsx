import { useEffect, useRef, Fragment, useReducer } from 'react'

import { FieldContext } from '../_context'
import FormControl from './form_control'
import { FormFieldProps } from './props'

function FormField(props: FormFieldProps) {
  const { name, children } = props

  // 重置次数
  const [resetCount, updateCount] = useReducer((count) => count + 1, 0)
  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 父级表单
  const parent = FieldContext.useState()
  const control = useRef(new FormControl(forceUpdate))
  useEffect(() => {
    control.current.register(parent, name)
  }, [parent, name])

  return <Fragment key={resetCount}>{children}</Fragment>
}

export default FormField
