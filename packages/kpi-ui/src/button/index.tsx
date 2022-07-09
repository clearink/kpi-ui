import { useEffect } from 'react'
import { usePrefix } from '@hooks'
import useWave from '@hooks/use_wave'
import { withDefault, omit } from '@utils'
import useBtnClass from './hooks/use_btn_class'
import { ButtonProps } from './props'
// 导出组件属性
export type { ButtonProps }

function Button(props: ButtonProps) {
  const { children, htmlType, type, ...rest } = props
  const attrs = omit(rest, ['block', 'danger', 'shape', 'size', 'ghost', 'loading'])

  const [ref, destroy] = useWave<HTMLButtonElement>()

  useEffect(() => {
    if (type === 'text') destroy.current()
  }, [destroy, type])
  const className = useBtnClass(usePrefix('button'), props)

  return (
    <button className={className} ref={ref} type={htmlType} {...attrs}>
      <span>{children}</span>
    </button>
  )
}
export default withDefault(Button, { htmlType: 'button', type: 'default' })
