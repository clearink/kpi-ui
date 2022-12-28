import { useReducer, useRef } from 'react'
import { useMounted } from '../../../hooks'
import { isUndefined } from '../../../utils'
import { FormGroupControl } from '../control'
import type { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const ref = useRef<FormInstance<State>>()
  const mounted = useMounted()
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  if (isUndefined(ref.current)) {
    if (form) ref.current = form
    else ref.current = new FormGroupControl(forceUpdate, mounted).injectForm()
  }

  return ref.current!
}
