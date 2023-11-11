import { isString, shallowMergeWithFallback } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import Col from '../../../col'
import { FormContext } from '../../_shared/context'
import normalizeLabelChildren from '../../utils/normalize_label'
import useFormatClass from './hooks/use_format_class'

import type { FormItemLabelProps } from './props'

function FormItemLabel(props: FormItemLabelProps) {
  const fallbacks = shallowMergeWithFallback(props, FormContext.useState(), [
    'colon',
    'labelAlign',
    'labelCol',
    'labelWrap',
    'requiredMark',
    'layout',
  ])

  const prefixCls = usePrefixCls('form-item__label')

  const classes = useFormatClass(prefixCls, props, fallbacks)

  const { htmlFor, label } = props

  const htmlTitle = isString(label) ? label : undefined

  return (
    <Col {...fallbacks.labelCol} className={classes}>
      <label htmlFor={htmlFor} title={htmlTitle}>
        {normalizeLabelChildren(props, fallbacks)}
      </label>
    </Col>
  )
}

export default FormItemLabel
