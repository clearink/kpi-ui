import { usePrefix } from '../_hooks'
import { withDefault } from '../_utils'
import useColClass from './hooks/use_col_class'
import { ColProps } from './props'

function Col(props: ColProps) {
  const { children } = props
  const name = usePrefix('col')
  const className = useColClass(name, props)

  return <div className={className}>{children}</div>
}

export default withDefault(Col, {})
