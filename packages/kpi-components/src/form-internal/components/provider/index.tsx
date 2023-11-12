import { noop } from '@kpi-ui/utils'
import { useMemo, useRef } from 'react'
import { batch } from '../../../_shared/utils'
import { InternalFormContext, type InternalFormContextState } from '../../_shared/context'
import FormProviderControl from './control'

import type { Forms, InternalFormProviderProps } from './props'

export default function FormProvider(props: InternalFormProviderProps) {
  // TODO: chore
  // const control = useConstant(() => new FormProviderControl())

  const forms = useRef<Forms>({})

  const provider = InternalFormContext.useState()

  const formContext = useMemo<InternalFormContextState>(() => {
    return {
      // 为每一个 FormProvider 注册表单实例 同时返回取消事件
      register: batch(provider.register, (form, name) => {
        if (!name) return noop
        forms.current[name] = form
        return () => {
          delete forms.current[name]
        }
      }),
      triggerFormChange: provider.triggerFormChange,
      triggerFormFinish: provider.triggerFormFinish,
    }
  }, [provider])

  return (
    <InternalFormContext.Provider value={formContext}>
      {props.children}
    </InternalFormContext.Provider>
  )
}
