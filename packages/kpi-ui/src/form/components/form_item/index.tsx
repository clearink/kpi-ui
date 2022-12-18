import Row from '../../../row'
import FormItemLabel from './label'
import FormItemInput from './input'
import { usePrefixCls } from '../../../_internal/hooks'
import { useFormItemClass } from '../../hooks/use_class'
import useFormItemId from '../../hooks/use_item_id'
import { pick } from '../../../_internal/utils'
import { FormContext } from '../../../_internal/context'
import useInjectChildren from '../../hooks/use_inject_children'
import useFormItemStatus from '../../hooks/use_item_status'

import type { FormItemProps } from '../../props'

function InternalFormItem<State = any>(props: FormItemProps<State>) {
  const { noStyle, name, label } = props

  const { formName } = FormContext.useState()

  const prefixCls = usePrefixCls('form-item')

  const formItemId = useFormItemId(name, formName)

  const [normalizedChildren, errorInfo] = useInjectChildren(props, formItemId)

  const className = useFormItemClass(props, errorInfo.validateStatus, prefixCls)

  // 仅作为渲染组件使用
  if (noStyle) return normalizedChildren

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
        {!!label && <FormItemLabel htmlFor={formItemId} {...labelProps} prefixCls={prefixCls} />}
        <FormItemInput {...inputProps} {...errorInfo} prefixCls={prefixCls}>
          {normalizedChildren}
        </FormItemInput>
      </Row>
    </div>
  )
}

type CompoundedComponent = typeof InternalFormItem & {
  useStatus: typeof useFormItemStatus
}

const FormItem = InternalFormItem as CompoundedComponent
FormItem.useStatus = useFormItemStatus

export default FormItem
