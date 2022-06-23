import { usePrefix } from '../_util/hooks'
import useBreadcrumbClass from './hooks/use_breadcrumb_class'
import withDefaultProps from '../_util/hocs/withDefaultProps'
import { BreadcrumbProps } from './props'
// 导出组件属性
export type { BreadcrumbProps }

// TODO: 待开发
function Breadcrumb(props: BreadcrumbProps) {
  const name = usePrefix('breadcrumb')
  const className = useBreadcrumbClass(name, props)
  return <div className={className}>breadcrumb</div>
}

export default withDefaultProps(Breadcrumb, {})
