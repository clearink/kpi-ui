/* eslint-disable react/button-has-type */
import { ForwardedRef, forwardRef, useImperativeHandle, type MouseEvent } from 'react'
import { omit } from '@kpi/shared'
import { withDefaultProps } from '@kpi/internal'
import { useWave } from '../_internal/hooks'
import useClass from './hooks/use_class'

import type { ButtonProps } from './props'

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, htmlType, onClick, loading, ...rest } = props

  const attrs = omit(rest, ['type', 'block', 'danger', 'shape', 'size', 'ghost'])

  useImperativeHandle(ref, () => internalRef.current!)

  const internalRef = useWave<HTMLButtonElement>()

  const className = useClass(props)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (attrs.disabled || loading) e.preventDefault()
    else onClick?.(e)
  }

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
export default withDefaultProps(forwardRef(Button), {
  htmlType: 'button',
  type: 'default',
} as const)
