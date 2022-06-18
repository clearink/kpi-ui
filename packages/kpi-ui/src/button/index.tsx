import withDefaultProps from '../_util/hocs/withDefaultProps'
import { usePrefix } from '../_util/hooks'
import useWave from '../_util/hooks/use_wave'
import { omit } from '../_util/value'
import useBtnClass from './hooks/use_btn_class'
import { ButtonProps } from './props'
// 导出组件属性
export type { ButtonProps }

function Button(props: ButtonProps) {
  const { children, htmlType, ...rest } = props
  const attrs = omit(rest, ['type', 'block', 'danger', 'shape', 'size', 'ghost', 'loading'])

  const ref = useWave<HTMLButtonElement>()
  const className = useBtnClass(usePrefix('button'), props)

  return (
    <button className={className} ref={ref} type={htmlType} {...attrs}>
      <span>{children}</span>
    </button>
  )
}
export default withDefaultProps(Button, { htmlType: 'button', type: 'default' })
