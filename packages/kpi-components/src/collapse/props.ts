export type ExpandedKey = React.Key | React.Key[]

export interface CollapseProps<K extends ExpandedKey = ExpandedKey> {
  expandedKey?: K
  onChange?: (expandedKey: K) => void
}
