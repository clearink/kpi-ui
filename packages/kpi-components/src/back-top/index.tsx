import { withDefaults } from '@kpi-ui/utils'
import useFormatClass from './hooks/use_format_class'

import type { BackTopProps } from './props'

function BackTop(props: BackTopProps) {
  const classes = useFormatClass(props)

  return <div className={classes}>back-top</div>
}

export default withDefaults(BackTop, {
  duration: 200,
  threshold: 400,
} as const)
