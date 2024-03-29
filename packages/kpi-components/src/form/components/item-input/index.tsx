import { fallback, getElementStyle, isNullish } from '@kpi-ui/utils'
import { useEffect, useMemo, useState } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { FormContext, FormItemContext } from '../../_shared/context'
import useFormatClass from './hooks/use_format_class'
import useFormatStatus from './hooks/use_format_status'
import useMetaState from './hooks/use_meta_state'
// comps
import Col from '../../../col'
import FormErrorList from '../error-list'
// types
import type { FormItemInputProps } from './props'

// TODO: refactor offset logic
function FormItemInput(props: FormItemInputProps) {
  const { children, validateStatus: _status, extra, help, getOuter } = props

  const ctx = FormContext.useState()

  const wrapperCol = fallback(props.wrapperCol, ctx.wrapperCol)

  const [meta, onMetaChange] = useMetaState()

  const [subMeta, onSubMetaChange] = useMetaState()

  const [offset, setOffset] = useState(0)

  const status = useFormatStatus(meta, _status)

  const prefixCls = usePrefixCls('form-item__control')

  const classes = useFormatClass(prefixCls, status, wrapperCol)

  const formItemContext = useMemo(() => ({ validateStatus: status }), [status])

  const errors = meta.errors.concat(subMeta.errors)

  const warnings = meta.warnings.concat(subMeta.warnings)

  const hasError = !!(help || errors.length || warnings.length)

  const showErrorList = !!(hasError || offset)

  useEffect(() => {
    const $outer = getOuter()

    if (!hasError || !$outer) return

    const styles = getElementStyle($outer)

    setOffset(parseFloat(styles.marginBottom))
  }, [getOuter, hasError])

  return (
    <FormItemContext.Provider value={formItemContext}>
      <Col {...wrapperCol} className={classes}>
        <div className={`${prefixCls}-input`}>{children(onMetaChange, onSubMetaChange)}</div>

        {showErrorList && (
          <div className={`${prefixCls}-status`}>
            {!!offset && <div className={`${prefixCls}-holder`} style={{ height: offset }} />}
            <FormErrorList
              help={help}
              errors={errors}
              warnings={warnings}
              helpStatus={status}
              onExitComplete={() => !hasError && setOffset(0)}
            />
          </div>
        )}

        {!isNullish(extra) && <div className={`${prefixCls}-extra`}>{extra}</div>}

        {!!offset && <div className={`${prefixCls}-offset`} style={{ marginBottom: -offset }} />}
      </Col>
    </FormItemContext.Provider>
  )
}

export default FormItemInput
