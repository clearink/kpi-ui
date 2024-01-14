import { useConstant, useForceUpdate, useMounted } from '@kpi-ui/hooks'
import FormGroupControl from '../control'

import type { ExternalFormInstance } from '../control/props'

export default function useForm<S = any>(form?: ExternalFormInstance<S>) {
  const mounted = useMounted()

  const forceUpdate = useForceUpdate()

  return useConstant<ExternalFormInstance<S>>(() => {
    if (form) return form
    return new FormGroupControl(() => mounted() && forceUpdate()).injectForm()
  })
}
