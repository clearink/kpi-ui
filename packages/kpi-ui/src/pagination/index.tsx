import { withDefault } from '../_utils'
import { usePrefix } from '../_hooks'
import usePaginationClass from './hooks/use_pagination_class'
// import { PaginationProps } from './props';

function Pagination() {
  const name = usePrefix('pagination')
  const className = usePaginationClass(name)

  return <div className={className}>pagination</div>
}

export default withDefault(Pagination, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
} as const)
