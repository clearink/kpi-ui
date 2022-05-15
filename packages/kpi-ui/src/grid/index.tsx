import { usePrefix } from '../_util/hooks'
import useGridClass from './hooks/use_grid_class'
import withDefaultProps from '../_util/hocs/withDefaultProps'
import { GridProps } from './props'

function Grid(props: GridProps) {
  const {} = props

  const name = usePrefix('grid')
  const className = useGridClass(name, props)

  return <div className={className}>grid</div>
}

export default withDefaultProps(Grid, {})

// 导出组件属性
export { GridProps }
