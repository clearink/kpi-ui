import { memo } from 'react'
import { isString, shallowMerge } from '@kpi/shared'
import Col from '../../../col'
import { FormContext } from '../../../_internal/context'
import { useFormItemLabelClass } from '../../hooks/use_class'
import { normalizeLabelChildren } from '../../utils/children'

import type { FormItemLabelExtraProps, FormItemLabelProps } from '../../props'

function FormItemLabel(props: FormItemLabelProps & FormItemLabelExtraProps) {
  // 合并同名字段值
  const mergedProps = shallowMerge(props, FormContext.useState())

  const { htmlFor, labelCol, label } = mergedProps

  const [labelColClassName, labelClassName] = useFormItemLabelClass(mergedProps)

  const htmlTitle = isString(label) ? label : undefined

  return (
    <Col {...labelCol} className={labelColClassName}>
      <label className={labelClassName} htmlFor={htmlFor} title={htmlTitle}>
        {normalizeLabelChildren(mergedProps)}
      </label>
    </Col>
  )
}
export default memo(FormItemLabel)
