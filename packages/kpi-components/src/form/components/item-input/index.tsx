import { useEvent } from '@kpi-ui/hooks'
import { shallowMergeWithPick } from '@kpi-ui/utils'
import cls from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import Col from '../../../col'
import { FormContext, FormItemContext, FormItemLayoutStableContext } from '../../_shared/context'
import FormErrorList from '../error-list'
import useFormatStatus from './hooks/use_format_status'
import useMetaState from './hooks/use_meta_state'

import type { FormItemInputProps } from './props'

function FormItemInput(props: FormItemInputProps) {
  const merged = shallowMergeWithPick(props, FormContext.useState(), ['wrapperCol'])

  const { children, extra, wrapperCol, prefixCls, help } = merged

  const layoutStableContext = FormItemLayoutStableContext.useState()

  const [meta, onMetaChange] = useMetaState()

  const [subMeta, onSubMetaChange] = useMetaState()

  const status = useFormatStatus(meta, merged.validateStatus)

  const formItemContext = useMemo(() => ({ validateStatus: status }), [status])

  const holder = useRef<HTMLDivElement>(null)

  const [running, setRunning] = useState(false)

  const errors = meta.errors.concat(subMeta.errors)

  const warnings = meta.warnings.concat(subMeta.warnings)

  const hasError = !!(help || errors.length || warnings.length)

  const showErrorList = !!(errors.length || warnings.length || running)

  const handleExitComplete = useEvent(() => {
    const inner = layoutStableContext.getInnerInstance()

    const instance = holder.current

    if (!inner || !instance || hasError) return

    inner.style.marginBottom = ''

    instance.style.height = ''

    setRunning(false)
  })

  useEffect(() => {
    const outer = layoutStableContext.getOuterInstance()

    const inner = layoutStableContext.getInnerInstance()

    const instance = holder.current

    if (!hasError || !outer || !inner || !instance) return

    const marginBottom = parseFloat(getComputedStyle(outer).marginBottom)

    inner.style.marginBottom = `-${marginBottom}px`

    instance.style.height = `${marginBottom}px`

    setRunning(true)
  }, [layoutStableContext, hasError])

  return (
    <FormItemContext.Provider value={formItemContext}>
      <Col {...wrapperCol} className={cls(`${prefixCls}__control`, wrapperCol?.className)}>
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
