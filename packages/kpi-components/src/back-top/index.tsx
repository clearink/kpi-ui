import { withDisplayName } from '@kpi-ui/utils'
import useFormatClass from './hooks/use_format_class'

import type { BackTopProps } from './props'

export const defaultProps: Partial<BackTopProps> = {}

function BackTop(props: BackTopProps) {
  const classes = useFormatClass(props)

  return <div className={classes}>back-top</div>
}

export default withDisplayName(BackTop)
