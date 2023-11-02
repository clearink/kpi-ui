import { useMemo } from 'react'
import { Form as InternalForm } from '@kpi-ui/internal'

import type { FormInstance, NamePath } from '../props'

// form 示例, TODO: 还需要额外实现 scrollToField
export default function useForm<State = any>(form?: FormInstance<State>) {
  const internalForm = InternalForm.useForm<State>()

  return useMemo<FormInstance>(() => {
    return (
      form ?? {
        ...internalForm,
        scrollToField: (name: NamePath) => {},
      }
    )
  }, [internalForm, form])
}
/** ==================================================== */
/** Features                                             */
/** ==================================================== */

// // TODO: 不属于该处的功能. 因为有可能没有dom
// // 滚动到对应位置
// scrollToField = (namePath: NamePath = []) => {
//   const key = _getName(namePath)

//   if (!key) return

//   const control = this.$controls.getControls().find(({ _key }) => _key === key)

//   const formName = this.$props.props.name
//   const fieldId = control?._getId(formName)
//   /**
//    *   public _getId = (parentName?: string) => {
//   return [parentName, ...this._name].filter((item) => item !== undefined).join('_')
// }
//    */

//   if (fieldId === undefined) return

//   const dom = document.querySelector(`#${fieldId}`)

//   dom?.scrollIntoView({ behavior: 'smooth' })
// }
