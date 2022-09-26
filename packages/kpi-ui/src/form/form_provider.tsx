import { ReactNode, useMemo, useRef } from 'react'
import { NOOP } from '../_constant'
import { FormContext } from '../_context'
import { useEvent } from '../_hooks'
import { omit } from '../_utils'
import { FormInstance, Forms } from './props'

export default function FormProvider(props: { children: ReactNode }) {
  const forms = useRef<Forms>({})
  const parent = FormContext.useState()

  // 注册表单实例
  const register = useEvent((form: FormInstance, name?: string) => {
    if (!name) return NOOP
    forms.current[name] = form
    // 往更上的层级冒泡
    const unregister = parent.register(form, name)
    // 取消注册
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
