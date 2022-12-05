import { useReducer, useRef } from 'react'
import { useMounted } from '../../_hooks'
import { FormGroupControl } from '../control'
import { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const ref = useRef<FormInstance<State>>()
  const mounted = useMounted()
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  if (ref.current === undefined) {
    if (form) ref.current = form
    else ref.current = new FormGroupControl(forceUpdate, mounted).injectForm()
  }

  return ref.current!
}
