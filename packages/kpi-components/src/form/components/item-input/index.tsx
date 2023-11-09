import { useEvent } from '@kpi-ui/hooks'
import { shallowMergeWithPick } from '@kpi-ui/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import Col from '../../../col'
import { FormContext, FormItemContext } from '../../_shared/context'
import FormErrorList from '../error-list'
import useFormatClass from './hooks/use_format_class'
import useFormatStatus from './hooks/use_format_status'
import useMetaState from './hooks/use_meta_state'

import type { FormItemInputProps } from './props'

function FormItemInput(props: FormItemInputProps) {
  const merged = shallowMergeWithPick(props, FormContext.useState(), ['wrapperCol'])

  const { children, extra, wrapperCol, prefixCls, help, getWrapper } = merged

  const [meta, onMetaChange] = useMetaState()

  const [subMeta, onSubMetaChange] = useMetaState()

  const inner = useRef<HTMLDivElement>(null)

  const holder = useRef<HTMLDivElement>(null)

  const [inLayout, setInLayout] = useState(false)

  const status = useFormatStatus(meta, merged.validateStatus)

  const classes = useFormatClass(prefixCls, status, wrapperCol)

  const formItemContext = useMemo(() => ({ validateStatus: status }), [status])

  const errors = meta.errors.concat(subMeta.errors)

  const warnings = meta.warnings.concat(subMeta.warnings)

  const hasError = !!(help || errors.length || warnings.length)

  const showErrorList = !!(errors.length || warnings.length || inLayout)

  const handleExitComplete = useEvent(() => {
    const innerInstance = inner.current

    const holderInstance = holder.current

    if (!innerInstance || !holderInstance || hasError) return

    innerInstance.style.marginBottom = ''

    holderInstance.style.height = ''

    setInLayout(false)
  })

  useEffect(() => {
    const wrapperInstance = getWrapper()

    const innerInstance = inner.current

    const holderInstance = holder.current

    if (!hasError || !wrapperInstance || !innerInstance || !holderInstance) return

    const styles = getComputedStyle(wrapperInstance)

    const marginBottom = parseFloat(styles.marginBottom)

    innerInstance.style.marginBottom = `-${marginBottom}px`

    holderInstance.style.height = `${marginBottom}px`

    setInLayout(true)
  }, [getWrapper, hasError])

  return (
    <FormItemContext.Provider value={formItemContext}>
      <Col flex={1} {...wrapperCol} className={classes} ref={inner}>
        <div className={`${prefixCls}__control-input`}>
          {children(onMetaChange, onSubMetaChange)}
        </div>

        {showErrorList ? (
          <div className={`${prefixCls}__control-status`}>
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
