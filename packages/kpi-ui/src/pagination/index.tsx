import { withDefaultProps } from '../_utils'
import useClass from './hooks/use_class'
import { PaginationProps } from './props'

function Pagination(props: PaginationProps) {
  const className = useClass(props)

  return <div className={className}>pagination</div>
}

export default withDefaultProps(Pagination, {})
