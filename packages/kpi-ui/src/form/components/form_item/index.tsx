import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Field as InternalFormField } from '../../../_internal/components/form'
import Row from '../../../row'
import FormItemLabel from './label'
import FormItemInput from './input'
import { FormContext, NoStyleContext } from '../../../_internal/context'
import { usePrefixCls } from '../../../_internal/hooks'
import { isUndefined, omit, pick, toArray } from '../../../_internal/utils'
import { isRequired } from '../../../_internal/utils/form_schema'
import { useFormItemClass } from '../../hooks/use_class'
import useFormItemId from '../../hooks/use_item_id'
import { normalizeItemChildren } from '../../utils/children'
import useFormItemStatus from '../../hooks/use_item_status'
import { makeEmptyMeta } from '../../utils/error'

import type { FormItemProps, ValidateStatus } from '../../props'
import type { FieldMeta } from '../../../_internal/components/form/internal_props'

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
    <InternalFormField {...props} onMetaChange={topMetaChange}>
      {normalizeItemChildren(props, formInstance!, formItemId)}
    </InternalFormField>
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
  const [meta, setMeta] = useState(makeEmptyMeta)
  const handleMetaChange = useCallback((fieldMeta: FieldMeta) => {
    const next = fieldMeta as FieldMeta & { mounted: boolean }
    if (next.mounted) setMeta(omit(next, ['mounted']))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [subMeta, setSubMeta] = useState(makeEmptyMeta)
  const handleSubMetaChange = useCallback((fieldMeta: FieldMeta) => {
    const next = fieldMeta as FieldMeta & { mounted: boolean }
    if (next.mounted) setSubMeta(omit(next, ['mounted']))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let status: ValidateStatus = ''
  if (!isUndefined($status)) status = $status
  else if (meta.validating) status = 'validating'
  else if (meta.errors.length) status = 'error'
  else if (meta.warnings.length) status = 'warning'
  else if (meta.touched) status = 'success'

  const className = useFormItemClass(props, status, prefixCls)

  const mergedErrors = useMemo(
    () => meta.errors.concat(subMeta.errors),
    [meta.errors, subMeta.errors]
  )
  const mergedWarnings = useMemo(
    () => meta.warnings.concat(subMeta.warnings),
    [meta.warnings, subMeta.warnings]
  )

  const ref = useRef<HTMLDivElement>(null)
  const [marginBottom, setMarginBottom] = useState<number>()

  const hasError = !!(help || mergedErrors.length || mergedWarnings.length)
  useLayoutEffect(() => {
    if (hasError && ref.current) {
      const styles = getComputedStyle(ref.current)
      setMarginBottom(parseInt(styles.marginBottom, 10))
    }
  }, [hasError])

  const handleExitComplete = useCallback(() => {
    !hasError && setMarginBottom(undefined)
  }, [hasError])

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

  const required = useMemo(() => (!toArray(name).length ? false : isRequired(rule)), [name, rule])

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
            <InternalFormField {...props} onMetaChange={handleMetaChange}>
              {normalizeItemChildren(props, formInstance!, formItemId)}
            </InternalFormField>
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
