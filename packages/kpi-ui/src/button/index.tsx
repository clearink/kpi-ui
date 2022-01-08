import { ButtonProps } from './props'

function Button(props: ButtonProps) {
  const { children } = props
  return (
    <div className="button">
      <span>{children}</span>
    </div>
  )
}
export default Button
