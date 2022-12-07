import { useMemo } from 'react'
import InternalUseForm from '@components/form/hooks/use_form'

import type { FormInstance } from '../props'

export default function useForm<State = any>(form?: FormInstance<State>) {
  const internalForm = InternalUseForm<State>()

  return useMemo(() => {
    return form ?? internalForm
  }, [internalForm, form])
}
