import { batch, noop } from '@kpi-ui/utils'
import { useMemo, useRef } from 'react'

// import FormProviderControl from './control'
import type { Forms, InternalFormProviderProps } from './props'

import { InternalFormContext, type InternalFormContextState } from '../../_shared/context'

export default function FormProvider(props: InternalFormProviderProps) {
  // TODO: chore
  // const control = useConstant(() => new FormProviderControl())

  const forms = useRef<Forms>({})

  const parentContext = InternalFormContext.useState()

  const formContext = useMemo<InternalFormContextState>(() => {
    return {
      register: batch(parentContext.register, (form, name) => {
        if (!name) return noop

        forms.current[name] = form

        // prettier-ignore
        return () => { delete forms.current[name] }
      }),
      triggerFormChange: parentContext.triggerFormChange,
      triggerFormFinish: parentContext.triggerFormFinish,
    }
  }, [parentContext])

  return (
    <InternalFormContext.Provider value={formContext}>
      {props.children}
    </InternalFormContext.Provider>
  )
}
