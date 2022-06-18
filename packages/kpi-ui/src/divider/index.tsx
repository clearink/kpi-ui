import { useMemo } from 'react'
import withDefaultProps from '../_util/hocs/withDefaultProps'
import { usePrefix } from '../_util/hooks'
import capitalize from '../_util/capitalize'
import { omit } from '../_util/value'
import useDividerClass from './hooks/use_divider_class'
import { DividerProps } from './props'
// 导出组件属性
export type { DividerProps }

function Divider(props: DividerProps) {
  const { children, orientation, orientationMargin, ...rest } = props
  const attrs = omit(rest, ['className', 'type', 'dashed', 'plain'])

  const name = usePrefix('divider')
  const className = useDividerClass(name, props)

  const innerStyle = useMemo(() => {
    const prop = `margin${capitalize(orientation)}`
    return { [prop]: orientationMargin }
  }, [orientation, orientationMargin])

  return (
    <div className={className} {...attrs}>
      {children && (
        <span className={`${name}__inner-text`} style={innerStyle}>
          {children}
        </span>
      )}
    </div>
  )
}

export default withDefaultProps(Divider, {
  dashed: false,
  orientation: 'center',
  plain: false,
  type: 'horizontal',
})
