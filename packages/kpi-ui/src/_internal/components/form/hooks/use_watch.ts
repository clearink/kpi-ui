import { useState } from 'react'
import { FieldContext } from '../../../context'
import { useIsomorphicEffect } from '../../../hooks'
import { isUndefined, logger } from '../../../utils'
import { HOOK_MARK } from '../control'
import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, NamePath } from '../props'

export function useWatchValue(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState()
  const formInstance = FieldContext.useState()
  const instance = (form ?? formInstance) as InternalFormInstance | undefined
  const formGroup = instance?.getInternalHooks(HOOK_MARK)

  logger.error(
    !instance,
    'useWatch requires a form instance since it can not auto detect from context.'
  )

  useIsomorphicEffect(() => {
    if (isUndefined(namePath)) return
    formGroup?.registerWatch(namePath, setValue)
  }, [namePath, formGroup])
  return value
}

/**
 * TODO: 监听字段校验状态 Form.Item.useWatchStatus
 */
export function useWatchStatus() {}
