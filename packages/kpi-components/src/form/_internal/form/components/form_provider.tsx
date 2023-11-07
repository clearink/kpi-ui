import { ReactNode, useMemo, useRef } from 'react'
import { useEvent } from '@kpi-ui/hooks'
import { noop, withoutProperties } from '@kpi-ui/utils'
import { FormContext } from '../../context'

import type { FormInstance, Forms } from '../props'
import type { FormContextState } from '../../context'

export default function FormProvider(props: { children: ReactNode }) {
  const forms = useRef<Forms>({})

  const parentProvider = FormContext.useState()

  // 为每一个 FormProvider 注册表单实例 同时返回取消事件
  const register = useEvent((form: FormInstance, name?: string) => {
    if (!name) return noop

    forms.current[name] = form

    const unregister = parentProvider.register(form, name)

    return () => {
      forms.current = withoutProperties(forms.current, [name])
      unregister()
    }
  })

  const triggerFormChange = useEvent((formName, changedFields) => {
    parentProvider.triggerFormChange(formName, changedFields)
  }) as FormContextState['triggerFormChange']

  const triggerFormFinish = useEvent((formName, values) => {
    parentProvider.triggerFormFinish(formName, values)
  }) as FormContextState['triggerFormFinish']

  const context = useMemo(() => {
    return { register, triggerFormChange, triggerFormFinish }
  }, [register, triggerFormChange, triggerFormFinish])

  return <FormContext.Provider value={context}>{props.children}</FormContext.Provider>
}
