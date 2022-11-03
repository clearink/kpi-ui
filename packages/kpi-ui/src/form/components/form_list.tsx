import { useMemo, useRef } from 'react'
import Field from './form_field'
import { FieldContext, FieldListContext } from '../../_context'
import { withDefaultProps } from '../../_hocs'
import { useDeepMemo, useEvent } from '../../_hooks'
import { toArray } from '../../_utils'
import { isDependent } from '../utils/path'
import { getIn } from '../utils/value'
import { FormArrayControl } from '../control'
import { collectListInjectProps } from '../utils/collect'

import type { FormListProps } from '../props'
import type { UpdateFieldAction as Action } from '../internal_props'

// 应该时继承 InternalFormFieldProps
function FormList(props: FormListProps) {
  const { name, rule, validateTrigger, initialValue } = props
  const context = FieldContext.useState()
  const control = useRef(new FormArrayControl())
  // 同步 context 供内部调用

  const listPath = useDeepMemo(() => {
    return toArray(context.parentNamePath).concat(toArray(name))
  }, [context.parentNamePath, name])

  const fieldContext = useMemo(() => {
    return { ...context, parentNamePath: listPath }
  }, [context, listPath])

  control.current.setFormContext(context, listPath)

  const fieldListContext = useMemo(() => {
    return null
  }, [])

  const shouldUpdate = useEvent((prev: any, next: any, action: Action) => {
    const path = toArray(name)
    const prevList = getIn(prev, path) as any[]
    const nextList = getIn(next, path) as any[]
    // 用户主动触发的默认不更新 或者 setFieldValue
    if (action.type === 'setField' || action.type === 'fieldEvent') {
      const listChanged = isDependent(name, action.name)
      return listChanged && prevList?.length !== nextList?.length
    }

    return prevList !== nextList
  })
  const operations = useMemo(() => control.current._getFeatures(), [])

  return (
    <FieldListContext.Provider value={fieldListContext}>
      <FieldContext.Provider value={fieldContext}>
        <Field
          name={[]}
          rule={rule}
          validateTrigger={validateTrigger}
          initialValue={initialValue}
          shouldUpdate={shouldUpdate}
        >
          {collectListInjectProps(props, listPath, control.current, operations)}
        </Field>
      </FieldContext.Provider>
    </FieldListContext.Provider>
  )
}

export default withDefaultProps(FormList, {} as const)
