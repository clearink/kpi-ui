// types
import type { IconProps } from './props'
import { definitionToNode } from './utils'

export default function Icon(props: IconProps) {
  return definitionToNode(props.icon)
}
