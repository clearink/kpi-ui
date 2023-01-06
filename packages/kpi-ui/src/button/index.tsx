import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { useWave } from '../_internal/hooks'
import { withDefaultProps } from '../_internal/hocs'
import { omit } from '../_internal/utils'
import useClass from './hooks/use_class'
import { ButtonProps } from './props'

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, htmlType, type, ...rest } = props
  const attrs = omit(rest, ['block', 'danger', 'shape', 'size', 'ghost', 'loading'])

  useImperativeHandle(ref, () => internalRef.current!)

  const internalRef = useWave<HTMLButtonElement>()

  const className = useClass(props)

  return (
    <button className={className} ref={internalRef} type={htmlType} {...attrs}>
      <span>{children}</span>
    </button>
  )
}
export default withDefaultProps(forwardRef(Button), {
  htmlType: 'button',
  type: 'default',
} as const)
