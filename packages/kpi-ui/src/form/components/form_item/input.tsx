import { useMemo } from 'react'
import cls from 'classnames'
import Col from '../../../col'
import {
  FormContext,
  FormItemContext,
  NoStyleContext,
  FormItemInputContext,
} from '../../../_internal/context'
import { mergeSameNameProps } from '../../../_internal/utils'

import type { FormItemInputExtraProps, FormItemInputProps } from '../../props'
import type { FormItemContextState } from '../../../_internal/context'

export default function FormItemInput(props: FormItemInputProps & FormItemInputExtraProps) {
  // context state
  const formContextState = FormContext.useState()

  const { extra, help, wrapperCol, prefixCls } = mergeSameNameProps(props, formContextState)

  const formItemContext = useMemo<FormItemContextState>(() => ({ status: 'error' }), [])

  const noStyleContext = useMemo(() => ({}), [])

  const formItemInputContext = useMemo(() => ({}), [])

  return (
    <FormItemContext.Provider value={formItemContext}>
      {/* 设置noStyle 后的数据 */}
      <NoStyleContext.Provider value={noStyleContext}>
        <FormItemInputContext.Provider value={formItemInputContext}>
          <Col {...wrapperCol} className={cls(`${prefixCls}__control`, wrapperCol?.className)}>
            {props.children}
          </Col>
        </FormItemInputContext.Provider>
      </NoStyleContext.Provider>
    </FormItemContext.Provider>
  )
}
