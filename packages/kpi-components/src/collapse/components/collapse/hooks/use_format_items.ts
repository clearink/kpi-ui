// types
import type { CollapseProps, ExpandedKey } from '../props'

export default function useFormatItems<K extends ExpandedKey>(props: CollapseProps<K>) {
  return props.items
}
