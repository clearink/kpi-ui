import { memo, useMemo } from 'react'
import cls from 'classnames'
import Col from '../../../col'
import ErrorList from '../error_list'
import {
  FormContext,
  FormItemContext,
  NoStyleContext,
  FormErrorListContext,
} from '../../../_internal/context'
import { mergeSameNameProps } from '../../../_internal/utils'

import type { FormItemInputExtraProps, FormItemInputProps } from '../../props'
import type { FormItemContextState } from '../../../_internal/context'

function FormItemInput(props: FormItemInputProps & FormItemInputExtraProps) {
  // context state
  const formContextState = FormContext.useState()

  const { extra, wrapperCol, prefixCls, help, errors, warnings, validateStatus } =
    mergeSameNameProps(props, formContextState)

  const formItemContext = useMemo<FormItemContextState>(
    () => ({ validateStatus }),
    [validateStatus]
  )

  const noStyleContext = useMemo(() => ({}), [])

  const formErrorListContext = useMemo(() => ({ prefixCls }), [prefixCls])

  return (
    <FormItemContext.Provider value={formItemContext}>
      {/* 设置noStyle 后的数据 */}
      <NoStyleContext.Provider value={noStyleContext}>
        <Col {...wrapperCol} className={cls(`${prefixCls}__control`, wrapperCol?.className)}>
          <div className={`${prefixCls}__control-input`}>{props.children}</div>

          <FormErrorListContext.Provider value={formErrorListContext}>
            <ErrorList
              help={help}
              errors={errors}
              warnings={warnings}
              helpStatus={validateStatus}
            />
          </FormErrorListContext.Provider>

          {extra ? <div className={`${prefixCls}__control-extra`}>{extra}</div> : null}
        </Col>
      </NoStyleContext.Provider>
    </FormItemContext.Provider>
  )
}

export default memo(FormItemInput)
