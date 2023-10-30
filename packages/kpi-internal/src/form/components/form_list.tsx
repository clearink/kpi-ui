import {
  isArray,
  isFunction,
  isNullish,
  logger,
  rawType,
  toArray,
  useConstant,
  useDeepMemo,
  useEvent,
} from '@kpi/shared'
import { useMemo } from 'react'
import { FieldContext } from '../../context'
import { FormArrayControl } from '../control'
import { getIn } from '../utils/value'
import Field from './form_field'

import type { UpdateFieldActionType as ActionType } from '../internal_props'
import type { FieldData, FormListProps, ListField } from '../props'

export default function FormList(props: FormListProps) {
  const { name, rule, initialValue, preserve, children } = props

  const formInstance = FieldContext.useState()

  const listPath = useDeepMemo(() => {
    return toArray(formInstance.parentNamePath).concat(toArray(name))
  }, [formInstance.parentNamePath, name])

  const fieldContext = useMemo(() => {
    return { ...formInstance, parentNamePath: listPath }
  }, [formInstance, listPath])

  const control = useConstant(() => new FormArrayControl())

  control.setFormInstance(formInstance, listPath, rule)

  const shouldUpdate = useEvent((prev: any, next: any, type: ActionType) => {
    const path = toArray(name)
    const prevList = (getIn(prev, path) || []) as any[]
    const nextList = (getIn(next, path) || []) as any[]
    // 用户主动触发的默认不更新 或者 setFieldValue
    if (type === 'setFields' || type === 'fieldEvent') {
      return rawType(prevList) !== rawType(nextList) || prevList.length !== nextList.length
    }

    return prevList !== nextList
  })

  const helpers = useMemo(() => control._getFeatures(), [control])

  const invalidChildren = !isFunction(children) || isNullish(children)
  logger(invalidChildren, 'Form.List only accepts function as children.')

  if (invalidChildren) return null

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

          const listValue: ListField[] = value.map((_, index) => {
            return {
              key: control.ensureFieldKey(index),
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
