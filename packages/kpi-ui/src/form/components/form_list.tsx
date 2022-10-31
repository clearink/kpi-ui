import { useMemo } from 'react'
import Form from '..'
import { FieldContext, FieldListContext } from '../../_context'
import { withDefaultProps } from '../../_hocs'
import { useDeepMemo } from '../../_hooks'
import { toArray } from '../../_utils'
import { string } from '../../_utils/form_schema/locales/default'
import { FormArrayControl, HOOK_MARK } from '../control'

// 应该时继承 InternalFormFieldProps
function FormList(props: any) {
  const { name } = props
  const context = FieldContext.useState()

  const parentPath = useMemo(() => {
    return [...toArray(context.parentNamePath), ...toArray(name)]
  }, [context.parentNamePath, name])

  const fieldContext = useMemo(() => {
    return { ...context, parentNamePath: parentPath }
  }, [context, parentPath])

  const fieldListContext = useMemo(() => {
    return null
  }, [])
  return (
    <FieldListContext.Provider value={fieldListContext}>
      <FieldContext.Provider value={fieldContext}>
        <Form.Field name={props.name}>
          {(values) => {
            return null
          }}
        </Form.Field>
      </FieldContext.Provider>
    </FieldListContext.Provider>
  )
}

export default withDefaultProps(FormList, {} as const)
