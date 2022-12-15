/* eslint-disable no-nested-ternary */
import Row from '../../../row'
import FormItemLabel from './label'
import FormItemInput from './input'
import { usePrefixCls } from '../../../_internal/hooks'
import { useFormItemClass } from '../../hooks/use_class'
import useFormItemId from '../../hooks/use_item_id'
import { pick } from '../../../_internal/utils'
import { FormContext } from '../../../_internal/context'

import type { FormItemProps } from '../../props'
import useInjectChildren from '../../hooks/use_inject_children'

export default function FormItem<State = any>(props: FormItemProps<State>) {
  const { noStyle, hidden, name } = props

  const { formName, form: formInstance } = FormContext.useState()

  const prefixCls = usePrefixCls('form-item')

  const className = useFormItemClass(props, prefixCls)

  const formItemId = useFormItemId(name, formName)

  const normalizedChildren = useInjectChildren(props, formInstance!, formItemId)

  // 仅作为渲染组件使用
  if (noStyle && !hidden) return normalizedChildren

  const labelProps = pick(props, [
    'colon',
    'htmlFor',
    'label',
    'labelAlign',
    'labelCol',
    'required',
    'requiredMark',
    'tooltip',
  ])

  const inputProps = pick(props, ['wrapperCol', 'extra', 'help'])

  return (
    <div className={className}>
      <Row className={`${prefixCls}__row`}>
        {!!props.label && (
          <FormItemLabel htmlFor={formItemId} {...labelProps} prefixCls={prefixCls} />
        )}
        <FormItemInput {...inputProps} prefixCls={prefixCls}>
          {normalizedChildren}
        </FormItemInput>
      </Row>
    </div>
  )
}
