import { useEvent } from '@kpi-ui/hooks'
import { noop, withoutProperties } from '@kpi-ui/utils'
import { useMemo, useRef } from 'react'
import { InternalFormContext, type InternalFormContextState } from '../../_shared/context'
import FormProviderControl from './control'

import type { ExternalFormInstance } from '../form/control/props'
import type { Forms, InternalFormProviderProps } from './props'

export default function FormProvider(props: InternalFormProviderProps) {
  // TODO: chore
  // const control = useConstant(() => new FormProviderControl())

  const forms = useRef<Forms>({})

  const provider = InternalFormContext.useState()

  // 为每一个 FormProvider 注册表单实例 同时返回取消事件
  const register = useEvent((form: ExternalFormInstance, name?: string) => {
    if (!name) return noop

    forms.current[name] = form

    const unregister = provider.register(form, name)

    return () => {
      forms.current = withoutProperties(forms.current, [name])
      unregister()
    }
  })

  const triggerFormChange = useEvent((formName, changedFields) => {
    provider.triggerFormChange(formName, changedFields)
  }) as InternalFormContextState['triggerFormChange']

  const triggerFormFinish = useEvent((formName, values) => {
    provider.triggerFormFinish(formName, values)
  }) as InternalFormContextState['triggerFormFinish']

  const formContext = useMemo(() => {
    return { register, triggerFormChange, triggerFormFinish }
  }, [register, triggerFormChange, triggerFormFinish])

  return (
    <InternalFormContext.Provider value={formContext}>
      {props.children}
    </InternalFormContext.Provider>
  )
}
