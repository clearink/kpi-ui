import { useState } from 'react'
import { FieldContext } from '../../_context'
import { useIsomorphicEffect } from '../../_hooks'
import { isUndefined } from '../../_utils'
import { HOOK_MARK } from '../control'
import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, NamePath } from '../props'

/**
 * TODO: 监听字段值
 */
export function useWatchValue(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState()
  const context = FieldContext.useState()
  const instance = (form ?? context) as InternalFormInstance | undefined
  const formGroup = instance?.getInternalHooks(HOOK_MARK)

  useIsomorphicEffect(() => {
    if (isUndefined(namePath)) return
    formGroup?.registerWatch(namePath, () => {})
  }, [namePath, formGroup])
  return value
}

/**
 * TODO: 监听字段状态
 */
export function useWatchStatus() {}
