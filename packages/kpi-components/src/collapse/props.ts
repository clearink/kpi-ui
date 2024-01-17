export type ExpandedKey = React.Key | React.Key[]

export interface CollapseProps<K extends ExpandedKey> {
  expandedKey?: K
  onChange?: (expandedKey: K) => void
}
