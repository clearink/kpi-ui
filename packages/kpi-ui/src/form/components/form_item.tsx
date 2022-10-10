import {
  useEffect,
  useRef,
  Fragment,
  useReducer,
  cloneElement,
  useCallback,
  isValidElement,
} from 'react'

import type { SyntheticEvent, FormEventHandler } from 'react'
import { FieldContext } from '../../_context'
import FormFieldControl from '../control/form_field'
import { HOOK_MARK } from '../control/form_control'
import type { FormItemProps } from '../props'
import { useEvent } from '../../_hooks'

function FormItem(props: FormItemProps) {
  const { name, children, rule, dependencies, shouldUpdate } = props

  // 重置次数
  const [resetCount, updateCount] = useReducer((count) => count + 1, 0)
  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 父级表单
  const parent = FieldContext.useState()?.getInternalHooks(HOOK_MARK)
  const control = useRef(new FormFieldControl(forceUpdate))
  parent?.addControl(control.current, name)

  // 销毁时从父级移除该字段
  useEffect(() => () => parent?.removeControl(name), [parent, name])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  const unwatch = parent?.watch(control.current, dependencies)
  const handlerUnwatch = useEvent(() => unwatch?.())
  // 销毁时同步删除监听
  useEffect(() => handlerUnwatch, [handlerUnwatch])

  // TODO: 抽离成hook
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
