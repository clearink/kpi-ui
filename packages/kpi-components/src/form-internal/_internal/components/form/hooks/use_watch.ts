import { useDeepMemo, useEvent } from '@kpi-ui/hooks'
import { isEqual, logger, toArray } from '@kpi-ui/utils'
import { useEffect, useMemo, useState } from 'react'
import { InternalFormInstanceContext } from '../../../_shared/context'
import { HOOK_MARK } from '../control'

import type { ExternalNamePath } from '../../../props'
import type { InternalFormInstance, ExternalFormInstance } from '../control/props'

export default function useWatchValue<T>(namePath?: ExternalNamePath, form?: ExternalFormInstance) {
  const [value, setValue] = useState<T | undefined>()

  const formInstance = InternalFormInstanceContext.useState()

  const instance = (form ?? formInstance) as InternalFormInstance | undefined

  const internalHook = useMemo(() => instance?.getInternalHooks(HOOK_MARK), [instance])

  const currentPath = useDeepMemo(() => toArray(namePath), [namePath])

  logger(!instance, 'useWatch requires a form instance since it can not auto detect from context.')

  const registerWatch = useEvent(() =>
    internalHook?.registerWatch(() => {
      const nextValue = instance?.getFieldValue(currentPath)
      if (!isEqual(nextValue, value)) setValue(nextValue)
    })
  )

  useEffect(registerWatch, [registerWatch, currentPath])

  return value
}
