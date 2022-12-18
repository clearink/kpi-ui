import { memo } from 'react'
import Col from '../../../col'
import { FormContext } from '../../../_internal/context'
import { isString, mergeSameNameProps } from '../../../_internal/utils'
import useFormItemLabelClass from '../../hooks/use_class'
import { normalizeLabelChildren } from '../../utils/children'

import type { FormItemLabelExtraProps, FormItemLabelProps } from '../../props'

function FormItemLabel(props: FormItemLabelProps & FormItemLabelExtraProps) {
  // context state
  const formContextState = FormContext.useState()

  // 合并同名字段值
  const mergedProps = mergeSameNameProps(props, formContextState)

  const { htmlFor, labelCol, label } = mergedProps

  const [labelColClassName, labelClassName] = useFormItemLabelClass(mergedProps)

  const htmlTitle = isString(label) ? label : undefined

  return (
    <Col {...labelCol} className={labelColClassName}>
      <label className={labelClassName} htmlFor={htmlFor} title={htmlTitle}>
        {normalizeLabelChildren(mergedProps, formContextState)}
      </label>
    </Col>
  )
}
export default memo(FormItemLabel)
