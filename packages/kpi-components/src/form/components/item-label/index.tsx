import { isString, shallowMergeWithFallback } from '@kpi-ui/utils'
import Col from '../../../col'
import { FormContext } from '../../_shared/context'
import { normalizeLabelChildren } from '../../utils/children'
import useFormatClass from './hooks/use_format_class'

import type { FormItemLabelProps } from './props'
import { usePrefixCls } from '../../../_shared/hooks'

function FormItemLabel(props: FormItemLabelProps) {
  const merged = shallowMergeWithFallback(props, FormContext.useState(), [
    'colon',
    'labelAlign',
    'labelCol',
    'labelWrap',
    'requiredMark',
    'layout',
  ])

  const prefixCls = usePrefixCls('form-item__label')

  const classes = useFormatClass(prefixCls, props, merged)

  const { htmlFor, label } = props

  const { labelCol } = merged

  const htmlTitle = isString(label) ? label : undefined

  return (
    <Col {...labelCol} className={classes}>
      <label htmlFor={htmlFor} title={htmlTitle}>
        {normalizeLabelChildren(props, merged)}
      </label>
    </Col>
  )
}

export default FormItemLabel
