import { useMemo } from 'react'
import { useForm as useInternalForm } from '../../_internal/components/form'

import type { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const internalForm = useInternalForm<State>()

  return useMemo(() => {
    return form ?? internalForm
  }, [internalForm, form])
}
