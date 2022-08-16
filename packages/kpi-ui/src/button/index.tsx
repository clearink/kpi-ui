import { withDefaultProps, omit } from '../_utils'
import { useWave } from '../_hooks'
import useClass from './hooks/use_class'
import { ButtonProps } from './props'

function Button(props: ButtonProps) {
  const { children, htmlType, type, ...rest } = props
  const attrs = omit(rest, ['block', 'danger', 'shape', 'size', 'ghost', 'loading'])

  const ref = useWave<HTMLButtonElement>()

  const className = useClass(props)

  return (
    <button className={className} ref={ref} type={htmlType} {...attrs}>
      <span>{children}</span>
    </button>
  )
}
export default withDefaultProps(Button, { htmlType: 'button', type: 'default' } as const)
