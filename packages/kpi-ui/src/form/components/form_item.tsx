import {
  useEffect,
  useRef,
  Fragment,
  useReducer,
  cloneElement,
  useCallback,
  isValidElement,
  Component,
} from 'react'

import type { SyntheticEvent, FormEventHandler } from 'react'
import { FieldContext } from '../../_context'
import { useEvent } from '../../_hooks'
import FormControl, { HOOK_MARK } from '../form_control'
import type { FormItemProps } from '../props'

function FormItem(props: FormItemProps) {
  const { name, children, rules } = props

  // 重置次数
  const [resetCount, updateCount] = useReducer((count) => count + 1, 0)
  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 父级表单
  const parent = FieldContext.useState()
  const control = useRef(new FormControl(forceUpdate))
  useEffect(() => {
    const $parent = parent?.getInternalHooks(HOOK_MARK)
    control.current.register($parent, name)
    // unregister 呢?
  }, [parent, name])
  const injectHandler = useCallback((onChange?: FormEventHandler) => {
    return (e: SyntheticEvent) => {
      onChange?.(e)
    }
  }, [])
  if (isValidElement(children)) {
    // TODO: 注入数据与事件
    const $onChange = injectHandler(children.props.onChange)
    const node = cloneElement(children as any, { onChange: $onChange })
  }

  return <Fragment key={resetCount}>{children}</Fragment>
}

export default FormItem
