import withDefaultProps from '../hocs/withDefaultProps'
import useDividerClass from './hooks/use_divider_class'
import { DividerProps } from './props'

function Divider(props: DividerProps) {
  const className = useDividerClass(props)
  return <div className={className}></div>
}
// dashed, orientation, orientationMargin, plain, type
export default withDefaultProps(Divider, {
  dashed: false,
  orientation: 'center',
  plain: false,
  type: 'horizontal',
})
