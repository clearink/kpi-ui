import { useRef } from 'react'
import FormStatus from '../control/form_status'
import type { FormFieldProps } from '../props'

/**
 * 字段状态
 * 1. 校验状态
 * 2. dirty
 * 3. touched
 */
export default function useFieldStatus(props: FormFieldProps, forceUpdate: () => void) {
  const ref = useRef(new FormStatus(forceUpdate))
  // 解析 props 分别设置对应属性
  return ref.current
}
