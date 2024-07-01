import { useConstant, useForceUpdate, useMounted } from '_shared/hooks'
import { useReducer } from 'react'

import { FormFieldControl } from '../control'

export default function useFieldControl() {
  const mounted = useMounted()
  // 重置次数
  const [resetCount, resetField] = useReducer((count) => count + 1, 0)
  // 强制更新视图
  const update = useForceUpdate()

  const control = useConstant(() => new FormFieldControl(update, resetField, mounted))

  return [control, resetCount] as const
}
