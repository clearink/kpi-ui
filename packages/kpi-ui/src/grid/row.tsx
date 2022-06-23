import { usePrefix } from '../_util/hooks'
import useRowClass from './hooks/use_row_class'
import withDefaultProps from '../_util/hocs/withDefaultProps'
import { RowProps } from './props'

function Row(props: RowProps) {
  const name = usePrefix('row')
  const className = useRowClass(name, props)

  return <div className={className}>grid</div>
}

export default withDefaultProps(Row, {
  align: 'top',
  gutter: 0,
  justify: 'start',
  wrap: true,
})
