import { useCallback, useMemo, useRef, useState } from 'react'
import { Form as InternalForm } from '@kpi/internal'
import {
  useDebounceState,
  isUndefined,
  omit,
  pick,
  toArray,
  useIsomorphicEffect,
} from '@kpi/shared'
import type { FieldMeta } from '@kpi/internal'
import Row from '../../../row'
import FormItemLabel from './label'
import FormItemInput from './input'
import { FormContext, NoStyleContext } from '../../../_internal/context'
import { usePrefixCls } from '../../../_internal/hooks'

import { useFormItemClass } from '../../hooks/use_class'
import useFormItemId from '../../hooks/use_item_id'
import { normalizeItemChildren } from '../../utils/children'
import useFormItemStatus from '../../hooks/use_item_status'
import { makeEmptyMeta } from '../../utils/error'

import type { FormItemProps, ValidateStatus } from '../../props'

const labelIncluded = [
  'colon',
  'htmlFor',
  'label',
  'labelAlign',
  'labelCol',
  'labelWrap',
  'required',
  'requiredMark',
  'tooltip',
] as const
const inputIncluded = ['wrapperCol', 'extra', 'help'] as const

function InternalFormItem<State = any>(props: FormItemProps<State>) {
  if (props.noStyle) return <NoStyleFormItem {...props} />

  return <CommonFormItem {...props} />
}

// 仅用于 noStyle 模式
function NoStyleFormItem(props: FormItemProps) {
  const { form: formInstance, formName } = FormContext.useState()

  const topMetaChange = NoStyleContext.useState()

  const formItemId = useFormItemId(props.name, formName)

  return (
    <InternalForm.Field {...props} onMetaChange={topMetaChange}>
      {normalizeItemChildren(props, formInstance!, formItemId)}
    </InternalForm.Field>
  )
}

function CommonFormItem(props: FormItemProps) {
  const { name, rule, label, style, help, validateStatus: $status } = props

  const { formName, form: formInstance } = FormContext.useState()

  const prefixCls = usePrefixCls('form-item')

  const formItemId = useFormItemId(name, formName)

  // if (isValidElement(children)) {
  //   // TODO: 检测是否支持 ref 获取 dom 用于实现 scrollToField
  // }
  const [meta, setMeta] = useDebounceState(45, makeEmptyMeta)
  const handleMetaChange = useCallback(
    (fieldMeta: FieldMeta) => {
      const next = fieldMeta as FieldMeta & { mounted: boolean }
      if (next.mounted) setMeta(omit(next, ['mounted']))
    },
    [setMeta]
  )

  const [subMeta, setSubMeta] = useDebounceState(45, makeEmptyMeta)
  const handleSubMetaChange = useCallback(
    (fieldMeta: FieldMeta) => {
      const next = fieldMeta as FieldMeta & { mounted: boolean }
      if (next.mounted) setSubMeta(omit(next, ['mounted']))
    },
    [setSubMeta]
  )

  const status = useMemo<ValidateStatus>(() => {
    let inner: ValidateStatus = ''
    if (!isUndefined($status)) inner = $status
    else if (meta.validating) inner = 'validating'
    else if (meta.errors.length) inner = 'error'
    else if (meta.warnings.length) inner = 'warning'
    else if (meta.touched) inner = 'success'
    return inner
  }, [meta, $status])

  const className = useFormItemClass(props, status, prefixCls)

  const required = useMemo(() => {
    return toArray(name).length <= 0 ? false : rule && rule.isRequired()
  }, [name, rule])

  const mergedErrors = meta.errors.concat(subMeta.errors)
  const mergedWarnings = meta.warnings.concat(subMeta.warnings)
  const hasError = !!(help || mergedErrors.length || mergedWarnings.length)

  const ref = useRef<HTMLDivElement>(null)
  const [marginBottom, setMarginBottom] = useState<number>()

  const handleExitComplete = useCallback(() => {
    !hasError && setMarginBottom(undefined)
  }, [hasError])

  useIsomorphicEffect(() => {
    if (hasError && ref.current) {
      const styles = getComputedStyle(ref.current)
      setMarginBottom(parseInt(styles.marginBottom, 10))
    }
  }, [hasError])

  const labelProps = pick(props, labelIncluded)

  const inputProps = pick(props, inputIncluded)

  return (
    <div className={className} style={style} ref={ref}>
      <Row className={`${prefixCls}__row`}>
        {!!label && (
          <FormItemLabel
            htmlFor={formItemId}
            required={required}
            prefixCls={prefixCls}
            {...labelProps}
          />
        )}

        <FormItemInput
          prefixCls={prefixCls}
          marginBottom={marginBottom}
          onExitComplete={handleExitComplete}
          {...inputProps}
          validateStatus={status}
          errors={mergedErrors}
          warnings={mergedWarnings}
        >
          <NoStyleContext.Provider value={handleSubMetaChange}>
            <InternalForm.Field {...props} onMetaChange={handleMetaChange}>
              {normalizeItemChildren(props, formInstance!, formItemId)}
            </InternalForm.Field>
          </NoStyleContext.Provider>
        </FormItemInput>
      </Row>
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
