import { shallowMerge } from '@kpi-ui/utils'
import cls from 'classnames'
import { useMemo } from 'react'
import Col from '../../../col'
import { FormContext, FormItemContext, type FormItemContextState } from '../../_shared/context'
import FormErrorList from '../error-list'

import type { FormItemInputExtraProps, FormItemInputProps } from './props'

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
            <FormErrorList
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
