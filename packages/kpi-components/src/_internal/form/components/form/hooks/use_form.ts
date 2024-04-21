import { useConstant, useForceUpdate, useMounted } from '@kpi-ui/hooks'
import FormGroupControl from '../control'
// types
import type { ExternalFormInstance } from '../control/props'

export default function useForm<S = any>(form?: ExternalFormInstance<S>) {
  const mounted = useMounted()

  const forceUpdate = useForceUpdate()

  return useConstant<ExternalFormInstance<S>>(() => {
    return form || new FormGroupControl(() => mounted() && forceUpdate()).injectForm()
  })
}
