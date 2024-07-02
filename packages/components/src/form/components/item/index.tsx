import Row from '@/row'
import { isNullish, pick } from '@kpi-ui/utils'
import { Form as InternalForm } from '_shared/components'
import { usePrefixCls } from '_shared/hooks'
import { createElement, useCallback, useRef } from 'react'

import type { FormItemProps } from './props'

import { FormContext, NoStyleContext } from '../../_shared/context'
import FormItemInput from '../item-input'
import FormItemLabel from '../item-label'
import useFormatClass from './hooks/use_format_class'
import useFormItemId from './hooks/use_item_id'
import normalizeChildren from './utils/normalize_children'

const labelIncluded = [
  'colon',
  'htmlFor',
  'label',
  'labelAlign',
  'labelCol',
  'labelWrap',
  'requiredMark',
  'tooltip',
] as const
const inputIncluded = ['wrapperCol', 'extra', 'help', 'validateStatus'] as const

// 仅用于 noStyle 模式
function NoStyleFormItem(props: FormItemProps) {
  const { form: formInstance, formName } = FormContext.useState()

  const handleMetaChange = NoStyleContext.useState()

  const itemId = useFormItemId(props.name, formName)

  return (
    <InternalForm.Field {...props} onMetaChange={handleMetaChange}>
      {normalizeChildren(props, formInstance, itemId)}
    </InternalForm.Field>
  )
}

function CommonFormItem(props: FormItemProps) {
  const { label, name, required, style } = props

  const { form: formInstance, formName } = FormContext.useState()

  const prefixCls = usePrefixCls('form-item')

  const itemId = useFormItemId(name, formName)

  const classes = useFormatClass(prefixCls, props)

  const $outer = useRef<HTMLDivElement>(null)

  const getOuter = useCallback(() => $outer.current, [])

  const labelProps = pick(props, labelIncluded)

  const inputProps = pick(props, inputIncluded)

  // if (isValidElement(children)) {
  //   // TODO: 检测是否支持 ref 获取 dom 用于实现 scrollToField
  // }

  return (
    <Row className={classes} ref={$outer} style={style}>
      {!isNullish(label) && <FormItemLabel htmlFor={itemId} required={required} {...labelProps} />}
      <FormItemInput {...inputProps} getOuter={getOuter}>
        {(onMetaChange, onSubMetaChange) => (
          <NoStyleContext.Provider value={onSubMetaChange}>
            <InternalForm.Field {...props} onMetaChange={onMetaChange}>
              {normalizeChildren(props, formInstance, itemId)}
            </InternalForm.Field>
          </NoStyleContext.Provider>
        )}
      </FormItemInput>
    </Row>
  )
}

export default function FormItem<State = any>(props: FormItemProps<State>) {
  return createElement(props.noStyle ? NoStyleFormItem : CommonFormItem, props)
}
