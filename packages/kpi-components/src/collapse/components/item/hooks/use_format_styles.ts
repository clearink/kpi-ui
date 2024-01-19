// types
import type { CollapseItemProps } from '../props'

export default function useFormatStyles(props: CollapseItemProps) {
  const { style, styles } = props

  return {
    root: { ...style, ...styles?.root },
    header: styles?.header,
    arrow: styles?.arrow,
    title: styles?.title,
    extra: styles?.extra,
    content: styles?.content,
  } as CollapseItemProps['styles'] & object
}
