import { withDefault } from '../_utils'
import { usePrefix } from '../_hooks'
import usePaginationClass from './hooks/use_pagination_class'
import { PaginationProps } from './props'

function Pagination(props: PaginationProps) {
  const name = usePrefix('pagination')
  const className = usePaginationClass(name, props)

  return <div className={className}>pagination</div>
}

export default withDefault(Pagination, {} as const)
