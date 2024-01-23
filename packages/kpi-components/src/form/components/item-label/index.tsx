import { fallback, isString } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import Col from '../../../col'
import { FormContext } from '../../_shared/context'
import normalizeChildren from './utils/normalize_children'
import useFormatClass from './hooks/use_format_class'

import type { FormItemLabelProps } from './props'

export const defaultProps: Partial<FormItemLabelProps> = {}

function FormItemLabel(_props: FormItemLabelProps) {
  const ctx = FormContext.useState()

  const props = {
    ..._props,
    colon: fallback(_props.colon, ctx.colon),
    labelAlign: fallback(_props.labelAlign, ctx.labelAlign),
    labelCol: fallback(_props.labelCol, ctx.labelCol),
    labelWrap: fallback(_props.labelWrap, ctx.labelWrap),
    requiredMark: fallback(_props.requiredMark, ctx.requiredMark),
  }

  const prefixCls = usePrefixCls('form-item__label')

  const classes = useFormatClass(prefixCls, props, ctx)

  const { htmlFor, label } = props

  const htmlTitle = isString(label) ? label : undefined

  return (
    <Col {...props.labelCol} className={classes}>
      <label htmlFor={htmlFor} title={htmlTitle}>
        {normalizeChildren(props, ctx)}
      </label>
    </Col>
  )
}

export default FormItemLabel
