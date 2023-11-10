import { useEvent } from '@kpi-ui/hooks'
import { shallowMergeWithFallback } from '@kpi-ui/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import Col from '../../../col'
import { FormContext, FormItemContext } from '../../_shared/context'
import FormErrorList from '../error-list'
import useFormatClass from './hooks/use_format_class'
import useFormatStatus from './hooks/use_format_status'
import useMetaState from './hooks/use_meta_state'

import type { FormItemInputProps } from './props'

function FormItemInput(props: FormItemInputProps) {
  const { children, validateStatus: _status, extra, help, getOuter } = props

  const { wrapperCol } = shallowMergeWithFallback(props, FormContext.useState(), ['wrapperCol'])

  const [meta, onMetaChange] = useMetaState()

  const [subMeta, onSubMetaChange] = useMetaState()

  const inner = useRef<HTMLDivElement>(null)

  const holder = useRef<HTMLDivElement>(null)

  const [inLayout, setInLayout] = useState(false)

  const status = useFormatStatus(meta, _status)

  const prefixCls = usePrefixCls('form-item__control')

  const classes = useFormatClass(prefixCls, status, wrapperCol)

  const formItemContext = useMemo(() => ({ validateStatus: status }), [status])

  const errors = meta.errors.concat(subMeta.errors)

  const warnings = meta.warnings.concat(subMeta.warnings)

  const hasError = !!(help || errors.length || warnings.length)

  const showErrorList = !!(errors.length || warnings.length || inLayout)

  const handleExitComplete = useEvent(() => {
    const $inner = inner.current

    const $holder = holder.current

    if (!$inner || !$holder || hasError) return

    $inner.style.marginBottom = ''

    $holder.style.height = ''

    setInLayout(false)
  })

  useEffect(() => {
    const $outer = getOuter()

    const $inner = inner.current

    const $holder = holder.current

    if (!hasError || !$outer || !$inner || !$holder) return

    const styles = getComputedStyle($outer)

    const marginBottom = parseFloat(styles.marginBottom)

    $inner.style.marginBottom = `-${marginBottom}px`

    $holder.style.height = `${marginBottom}px`

    setInLayout(true)
  }, [getOuter, hasError])

  return (
    <FormItemContext.Provider value={formItemContext}>
      <Col {...wrapperCol} className={classes} ref={inner}>
        <div className={`${prefixCls}-input`}>{children(onMetaChange, onSubMetaChange)}</div>

        {showErrorList ? (
          <div className={`${prefixCls}-status`}>
            <FormErrorList
              help={help}
              errors={errors}
              warnings={warnings}
              helpStatus={status}
              onExitComplete={handleExitComplete}
            />
            <div className={`${prefixCls}__layout-stable`} ref={holder} />
          </div>
        ) : null}

        {extra ? <div className={`${prefixCls}__control-extra`}>{extra}</div> : null}
      </Col>
    </FormItemContext.Provider>
  )
}

export default FormItemInput
