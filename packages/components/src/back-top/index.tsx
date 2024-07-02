import { withDisplayName } from '@kpi-ui/utils'

import type { BackTopProps } from './props'

import useFormatClass from './hooks/use_format_class'

function BackTop(props: BackTopProps) {
  const classes = useFormatClass(props)

  return <div className={classes}>back-top</div>
}

export default withDisplayName(BackTop)
