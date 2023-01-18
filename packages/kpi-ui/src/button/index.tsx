import { ForwardedRef, forwardRef, useImperativeHandle, type MouseEvent } from 'react'
import { useWave } from '../_internal/hooks'
import { withDefaultProps } from '../_internal/hocs'
import { omit } from '../_internal/utils'
import useClass from './hooks/use_class'
import { ButtonProps } from './props'

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, htmlType, type, onClick, loading, ...rest } = props

  const attrs = omit(rest, ['block', 'danger', 'shape', 'size', 'ghost'])

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
