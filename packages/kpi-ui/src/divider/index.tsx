import { useMemo } from 'react'
import { capitalize, omit } from '@kpi/shared'
import { withDefaultProps } from '../_internal/hocs'
import { usePrefixCls } from '../_internal/hooks'
import useClass from './hooks/use_class'
import { DividerProps } from './props'

function Divider(props: DividerProps) {
  const { children, orientation, orientationMargin, ...rest } = props
  const attrs = omit(rest, ['className', 'type', 'dashed', 'plain'])

  const name = usePrefixCls('divider')
  const className = useClass(name, props)

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
} as const)
