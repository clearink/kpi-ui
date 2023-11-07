import { useMounted } from '@kpi-ui/hooks'
import { useReducer, useRef } from 'react'
import { FormFieldControl, FormGroupControl } from '../control'

import type { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const mounted = useMounted()
  const instance = useRef<FormInstance<State>>()
  // 强制更新视图
  const forceUpdate = useReducer((count) => count + 1, 0)[1]

  if (instance.current) return instance.current

  instance.current = form ?? new FormGroupControl(forceUpdate, mounted).injectForm()

  return instance.current
}
