import { useMemo, useRef } from 'react'
import Field from './form_field'
import { FieldContext, FieldListContext } from '../../.internal/context'
import { withDefaultProps } from '../../.internal/hocs'
import { useDeepMemo, useEvent } from '../../.internal/hooks'
import { toArray } from '../../.internal/utils'
import { getIn } from '../utils/value'
import { FormArrayControl } from '../control'
import { collectListInjectProps } from '../utils/collect'

import type { FormListProps } from '../props'
import type { UpdateFieldActionType as ActionType } from '../internal_props'

function FormList(props: FormListProps) {
  const { name, rule, validateTrigger, initialValue, preserve } = props
  const formInstance = FieldContext.useState()
  const control = useRef(new FormArrayControl())
  // 同步 context 供内部调用

  const listPath = useDeepMemo(() => {
    return toArray(formInstance.parentNamePath).concat(toArray(name))
  }, [formInstance.parentNamePath, name])

  const fieldContext = useMemo(() => {
    return { ...formInstance, parentNamePath: listPath }
  }, [formInstance, listPath])

  control.current.setFormInstance(formInstance, listPath)

  const fieldListContext = useMemo(() => {
    return null
  }, [])

  const shouldUpdate = useEvent((prev: any, next: any, type: ActionType) => {
    const path = toArray(name)
    const prevList = getIn(prev, path) as any[]
    const nextList = getIn(next, path) as any[]
    // 用户主动触发的默认不更新 或者 setFieldValue
    if (type === 'setFields' || type === 'fieldEvent') {
      return prevList?.length !== nextList?.length
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
          preserve={preserve}
        >
          {collectListInjectProps(props, listPath, control.current, operations)}
        </Field>
      </FieldContext.Provider>
    </FieldListContext.Provider>
  )
}
// 默认卸载时不保留数据,可手动开启
export default withDefaultProps(FormList, { preserve: false } as const)
