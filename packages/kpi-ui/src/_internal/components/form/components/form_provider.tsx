import { ReactNode, useMemo, useRef } from 'react'
import { FormContext } from '../../../context'
import { useEvent } from '../../../hooks'
import { omit } from '../../../utils'
import type { FormInstance, Forms } from '../props'

export default function FormProvider(props: { children: ReactNode }) {
  const forms = useRef<Forms>({})
  const parent = FormContext.useState()

  // 为每一个 FormProvider 注册表单实例 同时返回取消事件
  const register = useEvent((form: FormInstance, name?: string) => {
    if (!name) return () => {}
    forms.current[name] = form
    const unregister = parent.register(form, name)
    return () => {
      forms.current = omit(forms.current, [name])
      unregister()
    }
  })
  const value = useMemo(() => {
    return { register }
  }, [register])
  return <FormContext.Provider value={value}>{props.children}</FormContext.Provider>
}
