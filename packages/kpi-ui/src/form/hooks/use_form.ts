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
/**
 * QA:
 * 1. 所需要暴露的方法
 * - submit 表单提交
 * - validate 表单校验
 * - reset 重置表单
 * - setFields 设置一组表单状态
 * - setField(s)Value 设置控件值
 * - getField(s)Value 获取对应控件值
 * - getField(s)Error
 */
