import { useReducer, useRef } from 'react'
import { useMounted } from '@kpi/shared'
import { FormArrayControl, FormFieldControl, FormGroupControl } from '../control'

import type { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const mounted = useMounted()
  const instance = useRef<FormInstance<State>>()
  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  if (instance.current) return instance.current

  instance.current = form ?? new FormGroupControl(forceUpdate, mounted).injectForm()

  return instance.current
}

export function useFormFieldControl() {
  const mounted = useMounted()
  // 重置次数
  const [resetCount, resetField] = useReducer((count) => count + 1, 0)
  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)
  const control = useRef<FormFieldControl>()

  const { current } = control
  control.current = current ?? new FormFieldControl(forceUpdate, resetField, mounted)

  return [control.current, resetCount] as const
}

export function useFormArrayControl() {
  const control = useRef<FormArrayControl>()

  const { current } = control
  control.current = current ?? new FormArrayControl()

  return control.current
}
