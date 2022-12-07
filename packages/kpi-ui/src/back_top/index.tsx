import { withDefaultProps } from '@hocs'
import useClass from './hooks/use_class'
import { BackTopProps } from './props'

function BackTop(props: BackTopProps) {
  const className = useClass(props)

  return <div className={className}>back-top</div>
}

export default withDefaultProps(BackTop, {
  duration: 200,
  threshold: 400,
})
