import useRipple from '../hooks/use_ripple'
import { ButtonProps } from './props'
import './style.scss'
function Button(props: ButtonProps) {
  const { children, style, className } = props
  const ref = useRipple<HTMLButtonElement>()
  return (
    <button className={`kpi-button ${className || ''}`} style={style} ref={ref}>
      <span className="kpi-button-text">{children}</span>
    </button>
  )
}
export default Button
