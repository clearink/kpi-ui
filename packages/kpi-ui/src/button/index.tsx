import withDefaultProps from '../hocs/withDefaultProps'
import usePrefix from '../hooks/use_prefix'
import useWave from '../hooks/use_wave'
import { omit } from '../utils/value'
import useBtnClass from './hooks/use_btn_class'
import { ButtonProps } from './props'

function Button(props: ButtonProps) {
  const { children, htmlType, ...rest } = props
  const ref = useWave<HTMLButtonElement>()

  const className = useBtnClass(usePrefix('button'), props)
  const attr = omit(rest, ['type', 'block', 'danger', 'shape', 'size', 'ghost', 'loading'])
  return (
    <button className={className} ref={ref} type={htmlType} {...attr}>
      <span>{children}</span>
    </button>
  )
}
export default withDefaultProps(Button, { htmlType: 'button', type: 'default' })
