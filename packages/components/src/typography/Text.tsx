import type { TextProps } from './props'

// 文本
function Text(props: TextProps) {
  const { children } = props
  return <div>{children}</div>
}
export default Text
