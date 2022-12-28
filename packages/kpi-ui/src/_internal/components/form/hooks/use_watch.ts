import { useState } from 'react'
import { FieldContext } from '../../../context/_internal'
import { useIsomorphicEffect } from '../../../hooks'
import { isUndefined, logger } from '../../../utils'
import { HOOK_MARK } from '../control'
import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, NamePath } from '../props'

export default function useWatchValue(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState()
  const formInstance = FieldContext.useState()
  const instance = (form ?? formInstance) as InternalFormInstance | undefined
  const internalHook = instance?.getInternalHooks(HOOK_MARK)

  logger.error(
    !instance,
    'useWatch requires a form instance since it can not auto detect from context.'
  )

  useIsomorphicEffect(() => {
    if (isUndefined(namePath)) return
    internalHook?.registerWatch(namePath, setValue)
  }, [namePath, internalHook])
  return value
}
