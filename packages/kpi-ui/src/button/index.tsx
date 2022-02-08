import useWave from '../hooks/use_wave'
import { omit } from '../utils/value'
import useBtnClass from './hooks/use_btn_class'
import { ButtonProps } from './props'
import './style/index.scss'
function Button(props: ButtonProps) {
  const { children, htmlType = 'button', ...rest } = props
  const ref = useWave<HTMLButtonElement>()

  const className = useBtnClass(props)
  const attr = omit(rest, ['type', 'block', 'danger', 'shape', 'size', 'ghost', 'loading'])
  return (
    <button className={className} ref={ref} type={htmlType} {...attr}>
      <span>{children}</span>
    </button>
  )
}
export default Button
