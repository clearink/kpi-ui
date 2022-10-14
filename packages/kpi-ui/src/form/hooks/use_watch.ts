import { useEffect, useState } from 'react'
import { FieldContext } from '../../_context'
import { HOOK_MARK } from '../control/control'
import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, NamePath } from '../props'

/**
 * TODO: 监听字段值
 */
export function useWatchValue(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState()
  const context = FieldContext.useState()
  const instance = (form ?? context) as InternalFormInstance | undefined
  const parent = instance?.getInternalHooks(HOOK_MARK)
  useEffect(() => {
    parent?.registerWatch(namePath, () => {})
  }, [namePath, parent])
  return value
}

/**
 * TODO: 监听字段状态
 */
export function useWatchStatus() {}
