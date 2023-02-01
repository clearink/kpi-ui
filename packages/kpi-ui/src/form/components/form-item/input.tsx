import { useMemo } from 'react'
import cls from 'classnames'
import { shallowMerge } from '@kpi/shared'
import Col from '../../../col'
import ErrorList from '../error-list'
import { FormContext, FormItemContext } from '../../../_internal/context'

import type { FormItemInputExtraProps, FormItemInputProps } from '../../props'
import type { FormItemContextState } from '../../../_internal/context'

function FormItemInput(props: FormItemInputProps & FormItemInputExtraProps) {
  const {
    extra,
    wrapperCol,
    prefixCls,
    help,
    errors,
    warnings,
    validateStatus,
    marginBottom,
    onExitComplete,
  } = shallowMerge(props, FormContext.useState())

  const formItemContext = useMemo<FormItemContextState>(
    () => ({ validateStatus }),
    [validateStatus]
  )

  return (
    <FormItemContext.Provider value={formItemContext}>
      <Col {...wrapperCol} className={cls(`${prefixCls}__control`, wrapperCol?.className)}>
        <div className={`${prefixCls}__control-input`}>{props.children}</div>
        {errors.length || warnings.length || marginBottom ? (
          <div className={`${prefixCls}__control-status`}>
            <ErrorList
              help={help}
              errors={errors}
              warnings={warnings}
              helpStatus={validateStatus}
              onExitComplete={onExitComplete}
            />
            {!!marginBottom && <div style={{ width: 0, height: marginBottom }} />}
          </div>
        ) : null}

        {extra ? <div className={`${prefixCls}__control-extra`}>{extra}</div> : null}
      </Col>
    </FormItemContext.Provider>
  )
}

export default FormItemInput
