import { usePrefix } from '../_hooks'
import { withDefaultProps } from '../_utils'
import useBreadcrumbClass from './hooks/use_breadcrumb_class'
// import { BreadcrumbProps } from './props';

// TODO: 待开发
function Breadcrumb() {
  const name = usePrefix('breadcrumb')
  const className = useBreadcrumbClass(name)
  return <div className={className}>breadcrumb</div>
}

export default withDefaultProps(Breadcrumb, {})
