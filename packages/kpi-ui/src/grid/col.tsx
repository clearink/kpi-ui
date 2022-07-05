import { usePrefix } from '../_util/hooks'
import useColClass from './hooks/use_col_class'
import withDefaultProps from '../_util/hocs/withDefaultProps'
// import { ColProps } from './props';

function Col() {
  const name = usePrefix('col')
  const className = useColClass(name)

  return <div className={className}>grid</div>
}

export default withDefaultProps(Col, {})
