import { ReactNode, useMemo, useRef } from 'react'
import { useEvent, omit } from '@kpi/shared'
import { FormContext } from '../../context'

import type { FormInstance, Forms } from '../props'

export default function FormProvider(props: { children: ReactNode }) {
  const forms = useRef<Forms>({})

  const parentProvider = FormContext.useState()

  // 为每一个 FormProvider 注册表单实例 同时返回取消事件
  const register = useEvent((form: FormInstance, name?: string) => {
    if (!name) return () => {}

    forms.current[name] = form

    const unregister = parentProvider.register(form, name)

    return () => {
      delete forms.current[name]
      unregister()
    }
  })

  const context = useMemo(() => ({ register }), [register])

  return <FormContext.Provider value={context}>{props.children}</FormContext.Provider>
}
