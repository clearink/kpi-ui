import { withDefaultProps, omit } from '../_utils'
import { usePrefix, useWave } from '../_hooks'
import useBtnClass from './hooks/use_btn_class'
import { ButtonProps } from './props'

function Button(props: ButtonProps) {
  const { children, htmlType, type, ...rest } = props
  const attrs = omit(rest, ['block', 'danger', 'shape', 'size', 'ghost', 'loading'])

  const ref = useWave<HTMLButtonElement>()

  const className = useBtnClass(usePrefix('button'), props)

  return (
    <button className={className} ref={ref} type={htmlType} {...attrs}>
      <span>{children}</span>
    </button>
  )
}
export default withDefaultProps(Button, { htmlType: 'button', type: 'default' } as const)
