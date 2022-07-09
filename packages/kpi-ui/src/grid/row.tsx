import { usePrefix } from '../_hooks'
import { withDefault } from '../_utils'
import useRowClass from './hooks/use_row_class'
import { RowProps } from './props'

function Row(props: RowProps) {
  const { children } = props
  const name = usePrefix('row')
  const className = useRowClass(name)

  return <div className={className}>{children}</div>
}

export default withDefault(Row, {
  align: 'top',
  gutter: 0,
  justify: 'start',
  wrap: true,
})
