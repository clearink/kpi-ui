import { useEffect, useMemo, useState } from 'react'
import { useDeepMemo, useEvent } from '@kpi-ui/hooks'
import { logger, isEqual, toArray } from '@kpi-ui/utils'
import { FieldContext } from '../../context'
import { HOOK_MARK } from '../control'

import type { FormInstance, NamePath } from '../props'
import type { InternalFormInstance } from '../internal_props'

export default function useWatchValue<T extends any>(namePath?: NamePath, form?: FormInstance) {
  const [value, setValue] = useState<T | undefined>()

  const formInstance = FieldContext.useState()

  const instance = (form ?? formInstance) as InternalFormInstance | undefined
  const internalHook = useMemo(() => instance?.getInternalHooks(HOOK_MARK), [instance])
  const currentPath = useDeepMemo(() => toArray(namePath), [namePath])

  logger(!instance, 'useWatch requires a form instance since it can not auto detect from context.')

  const registerWatch = useEvent(() => {
    return internalHook?.registerWatch(() => {
      const nextValue = instance?.getFieldValue(currentPath)
      if (!isEqual(nextValue, value)) setValue(nextValue)
    })
  })

  useEffect(registerWatch, [registerWatch, currentPath])

  return value
}
