import { useMemo } from 'react'
import withDefaultProps from '../hocs/withDefaultProps'
import usePrefix from '../hooks/use_prefix'
import capitalize from '../utils/capitalize'
import useDividerClass from './hooks/use_divider_class'
import { DividerProps } from './props'

function Divider(props: DividerProps) {
  const { children, orientation, orientationMargin, style } = props
  const name = usePrefix('divider')
  const className = useDividerClass(name, props)
  const innerTextMargin = useMemo(() => {
    const prop = `margin${capitalize(orientation)}`
    return { [prop]: orientationMargin }
  }, [orientation, orientationMargin])

  return (
    <div className={className} style={style}>
      {children ? (
        <span className={`${name}__inner-text`} style={innerTextMargin}>
          {children}
        </span>
      ) : null}
    </div>
  )
}
// dashed, orientation, orientationMargin, plain, type
export default withDefaultProps(Divider, {
  dashed: false,
  orientation: 'center',
  plain: false,
  type: 'horizontal',
})
