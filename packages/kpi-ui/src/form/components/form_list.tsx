import { useCallback, useMemo, useReducer, useRef } from 'react'
import { FieldContext } from '../../_context'
import { withDefaultProps } from '../../_hocs'
import { useEvent, useIsomorphicEffect, useMounted } from '../../_hooks'
import { FormArrayControl, HOOK_MARK } from '../control'

// 应该时继承 InternalFormFieldProps
function FormList(props: any) {
  const { name, dependencies, preserve, shouldUpdate } = props
  const context = FieldContext.useState()
  const internalHook = useMemo(() => context.getInternalHooks(HOOK_MARK), [context])

  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  const control = useRef(new FormArrayControl(name, forceUpdate, useMounted()))
  // 同步props性到 fieldControl
  control.current.setFieldProps(props)
  control.current.setParent()

  // 注册子字段 销毁时移除该字段
  // name 是数组会导致额外的 rerender 所以使用了useEvent
  const registerField = useEvent(() => {
    const cancel = internalHook?.registerField(control.current)
    // 确保拿到最新的数据
    if (shouldUpdate === true) forceUpdate()
    return () => cancel?.(preserve)
  })
  useIsomorphicEffect(registerField, [registerField])

  return <> null </>
}

export default withDefaultProps(FormList, {} as const)
