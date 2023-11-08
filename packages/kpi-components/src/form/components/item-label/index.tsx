import { isString, shallowMerge } from '@kpi-ui/utils'
import { memo } from 'react'
import Col from '../../../col'
import { FormContext } from '../../_shared/context'
import { normalizeLabelChildren } from '../../utils/children'
import useFormatClass from './hooks/use_format_class'

import type { FormItemLabelExtraProps, FormItemLabelProps } from './props'

function FormItemLabel(props: FormItemLabelProps & FormItemLabelExtraProps) {
  // 合并同名字段值
  const mergedProps = shallowMerge(props, FormContext.useState())

  const { htmlFor, labelCol, label } = mergedProps

  const [labelColClassName, labelClassName] = useFormatClass(mergedProps)

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
