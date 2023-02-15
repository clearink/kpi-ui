import { useMemo, useState } from 'react'
import { useIsomorphicEffect, logger, useEvent, isEqual, toArray } from '@kpi/shared'
import { FieldContext } from '../../context'
import { HOOK_MARK } from '../control'

import type { FormInstance, NamePath } from '../props'
import type { InternalFormInstance } from '../internal_props'

export default function useWatchValue<T extends any>(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState<T | undefined>()

  const formInstance = FieldContext.useState()

  const instance = (form ?? formInstance) as InternalFormInstance | undefined
  const internalHook = useMemo(() => instance?.getInternalHooks(HOOK_MARK), [instance])

  logger(!instance, 'useWatch requires a form instance since it can not auto detect from context.')

  const registerWatch = useEvent(() => {
    const currentPath = toArray(namePath)
    return internalHook?.registerWatch(currentPath, (next, path) => {
      isEqual(currentPath, path) && !isEqual(value, next) && setValue(next)
    })
  })

  useIsomorphicEffect(registerWatch, [registerWatch, namePath])

  return value
}
