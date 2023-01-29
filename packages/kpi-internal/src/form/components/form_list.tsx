import { useMemo, useRef } from 'react'
import { useDeepMemo, useEvent, isArray, isFunction, logger, rawType, toArray } from '@kpi/shared'

import Field from './form_field'
import { FieldContext } from '../../context'
import { getIn } from '../utils/value'
import { FormArrayControl } from '../control'

import type { FieldData, FormListProps, ListField } from '../props'
import type { UpdateFieldActionType as ActionType } from '../internal_props'

function FormList(props: FormListProps) {
  const { name, rule, initialValue, preserve = false, children } = props

  const formInstance = FieldContext.useState()

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

  const helpers = useMemo(() => control.current!._getFeatures(), [])

  if (!isFunction(children)) {
    logger(true, 'Form.List only accepts function as children.')
    return null
  }

  return (
    <FieldContext.Provider value={fieldContext}>
      <Field
        name={[]}
        rule={rule}
        initialValue={initialValue}
        shouldUpdate={shouldUpdate}
        preserve={preserve}
      >
        {({ value = [] }: any, meta: FieldData) => {
          if (!isArray(value)) {
            logger(true, `Current value of '${listPath.join(' > ')}' is not an array type.`)
            return children([], helpers, meta)
          }

          const listValue: ListField[] = value.map((__, index) => {
            return {
              key: control.current!.ensureFieldKey(index),
              name: index,
              isListField: true,
            }
          })

          return children(listValue, helpers, meta)
        }}
      </Field>
    </FieldContext.Provider>
  )
}
export default FormList
