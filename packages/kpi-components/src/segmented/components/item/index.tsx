import { withDisplayName } from '@kpi-ui/utils'
// types
import type { SegmentedItemProps } from './props'

function SegmentedItem(props: SegmentedItemProps) {
  const { classNames, styles } = props

  return (
    <div className={classNames.item} style={styles.item}>
      <div className={classNames.label} style={styles.label}></div>
    </div>
  )
}

export default withDisplayName(SegmentedItem)
