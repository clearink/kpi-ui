/* eslint-disable react/button-has-type */
import { withoutProperties } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, useImperativeHandle, type MouseEvent } from 'react'
import { usePrefixCls, useWave } from '../_internal/hooks'
import { withDefaults } from '../_internal/utils'
import useClass from './hooks/use_class'

import type { ButtonProps } from './props'

const excluded = [
  'children',
  'htmlType',
  'onClick',
  'loading',
  'type',
  'block',
  'danger',
  'shape',
  'size',
  'ghost',
] as const

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, htmlType, onClick, loading, disabled } = props

  const name = usePrefixCls('button')

  const className = useClass(name, props)

  useImperativeHandle(ref, () => internalRef.current!)

  const internalRef = useWave<HTMLButtonElement>()

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) e.preventDefault()
    else onClick && onClick(e)
  }

  const attrs = withoutProperties(props, excluded)

  return (
    <button
      className={className}
      ref={internalRef}
      type={htmlType}
      onClick={handleClick}
      {...attrs}
    >
      <span>{children}</span>
    </button>
  )
}
export default withDefaults(forwardRef(Button), {
  htmlType: 'button',
  type: 'default',
} as const)
