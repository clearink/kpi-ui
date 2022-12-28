import { useMemo, useReducer, useRef } from 'react'
import Field from './form_field'
import { FieldContext } from '../../../context/_internal'
import { withDefaultProps } from '../../../hocs'
import { useDeepMemo, useEvent } from '../../../hooks'
import { rawType, toArray } from '../../../utils'
import { getIn } from '../utils/value'
import { FormArrayControl } from '../control'
import { collectListInjectProps } from '../utils/collect'

import type { FormListProps } from '../props'
import type { UpdateFieldActionType as ActionType } from '../internal_props'

function FormList(props: FormListProps) {
  const { name, rule, initialValue, preserve } = props

  const formInstance = FieldContext.useState()

  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  const listPath = useDeepMemo(() => {
    return toArray(formInstance.parentNamePath).concat(toArray(name))
  }, [formInstance.parentNamePath, name])

  const fieldContext = useMemo(() => {
    return { ...formInstance, parentNamePath: listPath }
  }, [formInstance, listPath])

  const control = useRef<FormArrayControl>()
  if (!control.current) control.current = new FormArrayControl()

  control.current.setFormInstance(formInstance, listPath, rule)

  const shouldUpdate = useEvent((prev: any, next: any, type: ActionType) => {
    const path = toArray(name)
    const prevList = getIn(prev, path) as any[]
    const nextList = getIn(next, path) as any[]
    // 用户主动触发的默认不更新 或者 setFieldValue
    if (type === 'setFields' || type === 'fieldEvent') {
      return rawType(prevList) !== rawType(nextList) || prevList?.length !== nextList?.length
    }

    return prevList !== nextList
  })

  return (
    <>
      <button type="button" onClick={() => forceUpdate()}>
        forceUpdate
      </button>
      <FieldContext.Provider value={fieldContext}>
        <Field
          name={[]}
          rule={rule}
          initialValue={initialValue}
          shouldUpdate={shouldUpdate}
          preserve={preserve}
        >
          {collectListInjectProps(props, listPath, control.current)}
        </Field>
      </FieldContext.Provider>
    </>
  )
}
// 默认卸载时不保留数据,可手动开启
export default withDefaultProps(FormList, { preserve: false } as const)
