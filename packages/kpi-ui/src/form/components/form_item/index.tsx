import { useLayoutEffect, useRef, useState } from 'react'
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
  const { noStyle, name, label, style } = props

  const { formName } = FormContext.useState()

  const prefixCls = usePrefixCls('form-item')

  const formItemId = useFormItemId(name, formName)

  const [normalizedChildren, errorInfo, required] = useInjectChildren(props, formItemId)

  const className = useFormItemClass(props, errorInfo.validateStatus, prefixCls)

  const [marginBottom, setMarginBottom] = useState<number>()
  const ref = useRef<HTMLDivElement>(null)

  const hasError = errorInfo.errors.length > 0 || errorInfo.warnings.length > 0

  useLayoutEffect(() => {
    if (hasError && ref.current) {
      const styles = getComputedStyle(ref.current)
      setMarginBottom(parseInt(styles.marginBottom, 10))
    }
  }, [hasError])

  // 仅作为渲染组件使用
  if (noStyle) return normalizedChildren

  const labelProps = pick(props, [
    'colon',
    'htmlFor',
    'label',
    'labelAlign',
    'labelCol',
    'labelWrap',
    'required',
    'requiredMark',
    'tooltip',
  ])

  const inputProps = pick(props, ['wrapperCol', 'extra', 'help'])

  return (
    <div className={className} style={style} ref={ref}>
      <Row className={`${prefixCls}__row`}>
        {!!label && (
          <FormItemLabel
            htmlFor={formItemId}
            required={required}
            {...labelProps}
            prefixCls={prefixCls}
          />
        )}
        <FormItemInput {...inputProps} {...errorInfo} prefixCls={prefixCls}>
          {normalizedChildren}
        </FormItemInput>
      </Row>
      {/* 如何重置?需要监听ErrorList组件里回调函数 */}
      {!!marginBottom && <div style={{ marginBottom: -marginBottom }} />}
    </div>
  )
}

type CompoundedComponent = typeof InternalFormItem & {
  useStatus: typeof useFormItemStatus
}

const FormItem = InternalFormItem as CompoundedComponent
FormItem.useStatus = useFormItemStatus

export default FormItem
