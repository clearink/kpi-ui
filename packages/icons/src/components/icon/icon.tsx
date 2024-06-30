import { definitionToNode } from './utils'
// types
import type { IconProps } from './props'

export default function Icon(props: IconProps) {
  return definitionToNode(props.icon)
}
