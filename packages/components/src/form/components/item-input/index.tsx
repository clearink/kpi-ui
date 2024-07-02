import Col from '@/col'
import { getElementStyle, isNullish, withDefaults } from '@kpi-ui/utils'
import { usePrefixCls } from '_shared/hooks'
import { useEffect, useMemo, useState } from 'react'

import type { FormItemInputProps } from './props'

import { FormContext, FormItemContext } from '../../_shared/context'
import FormErrorList from '../error-list'
import useFormatClass from './hooks/use_format_class'
import useFormatStatus from './hooks/use_format_status'
import useMetaState from './hooks/use_meta_state'

// TODO: refactor offset logic
function FormItemInput(_props: FormItemInputProps) {
  const ctx = FormContext.useState()

  const props = withDefaults(_props, {
    wrapperCol: ctx.wrapperCol,
  })

  const { children, extra, getOuter, help, validateStatus: _status, wrapperCol } = props

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

    setOffset(Number.parseFloat(styles.marginBottom))
  }, [getOuter, hasError])

  return (
    <FormItemContext.Provider value={formItemContext}>
      <Col {...wrapperCol} className={classes}>
        <div className={`${prefixCls}-input`}>{children(onMetaChange, onSubMetaChange)}</div>

        {showErrorList && (
          <div className={`${prefixCls}-status`}>
            {!!offset && <div className={`${prefixCls}-holder`} style={{ height: offset }} />}
            <FormErrorList
              errors={errors}
              help={help}
              helpStatus={status}
              onExitComplete={() => !hasError && setOffset(0)}
              warnings={warnings}
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
