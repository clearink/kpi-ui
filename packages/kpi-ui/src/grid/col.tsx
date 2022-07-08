import { usePrefix } from '@hooks'
import { withDefault } from '@utils'
import useColClass from './hooks/use_col_class'
// import { ColProps } from './props';

function Col() {
  const name = usePrefix('col')
  const className = useColClass(name)

  return <div className={className}>grid</div>
}

export default withDefault(Col, {})
