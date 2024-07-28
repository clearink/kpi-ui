import { usePrefixCls } from '@comps/_shared/hooks'
import { withDefaults } from '@comps/_shared/utils'
import Col from '@comps/col'
import { isNullish } from '@internal/utils'
import { useMemo } from 'react'

import type { FormItemInputProps } from './props'

import { FormContext, FormItemContext } from '../../_shared/context'
import FormErrorList from '../error-list'
import useFormatClass from './hooks/use_format_class'
import useFormatStatus from './hooks/use_format_status'
import useItemInputOffset from './hooks/use_item_offset'
import useMetaState from './hooks/use_meta_state'

function FormItemInput(_props: FormItemInputProps) {
  const ctx = FormContext.useState()

  const props = withDefaults(_props, {
    wrapperCol: ctx.wrapperCol,
  })

  const { children, extra, help, validateStatus: _status, wrapperCol } = props

  const [meta, onMetaChange] = useMetaState()

  const [subMeta, onSubMetaChange] = useMetaState()

  const status = useFormatStatus(meta, _status)

  const prefixCls = usePrefixCls('form-item__control')

  const classes = useFormatClass(prefixCls, status, wrapperCol)

  const formItemContext = useMemo(() => ({ validateStatus: status }), [status])

  const errors = useMemo(() => meta.errors.concat(subMeta.errors), [meta.errors, subMeta.errors])

  const warnings = useMemo(() => meta.warnings.concat(subMeta.warnings), [meta.warnings, subMeta.warnings])

  const hasError = !isNullish(help) || !!(errors.length || warnings.length)

  const { returnEarly, offset, cleanOffset } = useItemInputOffset(props, hasError)

  if (returnEarly) return null

  return (
    <Col {...wrapperCol} className={classes}>
      <FormItemContext.Provider value={formItemContext}>
        <div className={`${prefixCls}-input`}>{children(onMetaChange, onSubMetaChange)}</div>

        {!!(hasError || offset) && (
          <div className={`${prefixCls}-status`} style={{ minHeight: offset }}>
            <FormErrorList
              errors={errors}
              help={help}
              helpStatus={status}
              warnings={warnings}
              onExitComplete={cleanOffset}
            />
          </div>
        )}

        {!isNullish(extra) && <div className={`${prefixCls}-extra`}>{extra}</div>}

        {!!offset && <div className={`${prefixCls}-offset`} style={{ marginBottom: -offset }} />}
      </FormItemContext.Provider>
    </Col>
  )
}

export default FormItemInput
