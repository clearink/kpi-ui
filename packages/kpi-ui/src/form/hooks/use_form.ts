import { useReducer, useRef } from 'react'
import FormControl from '../form_control'
import { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const ref = useRef<FormInstance<State>>()
  const [, forceUpdate] = useReducer((count) => count + 1, 0)
  if (ref.current === undefined) {
    if (form) ref.current = form
    else ref.current = new FormControl(forceUpdate).injectForm
  }
  return ref.current!
}
