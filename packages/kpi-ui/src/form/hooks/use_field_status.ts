import { useRef } from 'react'
import type { FormFieldProps } from '../props'

/**
 * 字段状态
 * 1. 校验状态
 * 2. dirty
 * 3. touched
 */
export default function useFieldStatus(props: FormFieldProps, forceUpdate: () => void) {
  const ref = useRef(null)
  // 解析 props 分别设置对应属性
  return ref.current
}
