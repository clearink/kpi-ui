/* eslint-disable no-nested-ternary */
import { cloneElement, isValidElement, useCallback } from 'react'
import { Field as InternalFormField } from '../../../_internal/components/form'
import Row from '../../../row'
import FormItemLabel from './label'
import FormItemInput from './input'
import { usePrefixCls } from '../../../_internal/hooks'
import { useFormItemClass } from '../../hooks/use_class'
import useFormItemId from '../../hooks/use_item_id'
import { pick } from '../../../_internal/utils'

import type { FormItemProps } from '../../props'
import type { FieldMeta } from '../../../_internal/components/form/internal_props'
import useInjectChildren from '../../hooks/use_inject_children'

export default function FormItem<State = any>(props: FormItemProps<State>) {
  const prefixCls = usePrefixCls('form-item')

  const className = useFormItemClass(props, prefixCls)

  const formItemId = useFormItemId(props.name)

  const handleMetaChange = useCallback((meta: FieldMeta) => {
    // console.log('meta change', meta)
  }, [])

  const children = useInjectChildren(props, formItemId)

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
        {props.label && (
          <FormItemLabel htmlFor={formItemId} {...labelProps} prefixCls={prefixCls} />
        )}
        <FormItemInput {...inputProps} prefixCls={prefixCls}>
          <InternalFormField {...props} onMetaChange={handleMetaChange}>
            {children}
          </InternalFormField>
        </FormItemInput>
      </Row>
    </div>
  )
}
