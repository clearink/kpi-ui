import { useState } from 'react'
import { useIsomorphicEffect, isUndefined, logger } from '@kpi/shared'
import { FieldContext } from '../../context'
import { HOOK_MARK } from '../control'

import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, NamePath } from '../props'

export default function useWatchValue<T extends any>(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState<T | undefined>()
  const formInstance = FieldContext.useState()
  const instance = (form ?? formInstance) as InternalFormInstance | undefined
  const internalHook = instance?.getInternalHooks(HOOK_MARK)

  logger(!instance, 'useWatch requires a form instance since it can not auto detect from context.')

  useIsomorphicEffect(() => {
    if (isUndefined(namePath)) return
    internalHook?.registerWatch(namePath, setValue)
  }, [namePath, internalHook])
  return value
}
