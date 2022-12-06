import { withDefaultProps } from '../.internal/hocs'
import useClass from './hooks/use_class'
// import { BreadcrumbProps } from './props';

// TODO: 待开发
function Breadcrumb() {
  const className = useClass()
  return <div className={className}>breadcrumb</div>
}

export default withDefaultProps(Breadcrumb, {})
