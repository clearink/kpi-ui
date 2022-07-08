import { withDefault } from '@utils'
import { usePrefix } from '../_hooks'
import useRowClass from './hooks/use_row_class'

function Row() {
  const name = usePrefix('row')
  const className = useRowClass(name)

  return <div className={className}>grid</div>
}

export default withDefault(Row, {
  align: 'top',
  gutter: 0,
  justify: 'start',
  wrap: true,
})
