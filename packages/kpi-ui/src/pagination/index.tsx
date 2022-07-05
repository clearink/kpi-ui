import { usePrefix } from '../_util/hooks'
import usePaginationClass from './hooks/use_pagination_class'
import withDefaultProps from '../_util/hocs/withDefaultProps'
// import { PaginationProps } from './props';

// TODO: 待开发
function Pagination() {
  const name = usePrefix('pagination')
  const className = usePaginationClass(name)

  return <div className={className}>pagination</div>
}

export default withDefaultProps(Pagination, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
})
