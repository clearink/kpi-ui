import { useConstant, useForceUpdate, useMounted } from '@kpi-ui/hooks'
import { useReducer } from 'react'
import FormFieldControl from '../control'

export default function useFormFieldControl() {
  const mounted = useMounted()
  // 重置次数
  const [resetCount, resetField] = useReducer((count) => count + 1, 0)
  // 强制更新视图
  const forceUpdate = useForceUpdate()

  const control = useConstant(() => new FormFieldControl(forceUpdate, resetField, mounted))

  return [control, resetCount] as const
}
