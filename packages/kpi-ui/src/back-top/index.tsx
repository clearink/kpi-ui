import { withDefaultProps } from '@kpi/internal'
import useClass from './hooks/use_class'
import { BackTopProps } from './props'

function BackTop(props: BackTopProps) {
  const className = useClass(props)

  return <div className={className}>back-top</div>
}

export default withDefaultProps(BackTop, {
  duration: 200,
  threshold: 400,
} as const)
