import { isString, shallowMergeWithPick } from '@kpi-ui/utils'
import { memo } from 'react'
import Col from '../../../col'
import { FormContext } from '../../_shared/context'
import { normalizeLabelChildren } from '../../utils/children'
import useFormatClass from './hooks/use_format_class'

import type { FormItemLabelProps } from './props'

// 46-50
function FormItemLabel(props: FormItemLabelProps) {
  const mergedProps = shallowMergeWithPick(props, FormContext.useState(), [
    'colon',
    'labelAlign',
    'labelCol',
    'labelWrap',
    'requiredMark',
  ])

  const [labelColClassName, labelClassName] = useFormatClass(mergedProps)

  const { htmlFor, labelCol, label } = mergedProps

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
