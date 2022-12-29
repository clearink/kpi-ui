import { useMemo, useReducer, useRef } from 'react'
import Field from './form_field'
import { FieldContext } from '../../../context/_internal'
import { withDefaultProps } from '../../../hocs'
import { useDeepMemo, useEvent } from '../../../hooks'
import { isArray, isFunction, logger, rawType, toArray } from '../../../utils'
import { getIn } from '../utils/value'
import { FormArrayControl } from '../control'

import type { FieldData, FormListProps, ListField } from '../props'
import type { UpdateFieldActionType as ActionType } from '../internal_props'

function FormList(props: FormListProps) {
  const { name, rule, initialValue, preserve, children } = props

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

  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  if (!isFunction(children)) {
    logger.error(true, 'Form.List only accepts function as children.')
    return null
  }

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
          {({ value = [] }: any, meta: FieldData) => {
            if (!isArray(value)) {
              logger.error(true, `Current value of '${listPath.join(' > ')}' is not an array type.`)
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
    </>
  )
}
// 默认卸载时不保留数据,可手动开启
export default withDefaultProps(FormList, { preserve: false } as const)
