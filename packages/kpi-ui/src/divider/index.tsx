import { useMemo } from 'react'
import { withDefaultProps } from '../.internal/hocs'
import { usePrefix } from '../.internal/hooks'
import { capitalize, omit } from '../.internal/utils'
import useClass from './hooks/use_class'
import { DividerProps } from './props'

function Divider(props: DividerProps) {
  const { children, orientation, orientationMargin, ...rest } = props
  const attrs = omit(rest, ['className', 'type', 'dashed', 'plain'])

  const name = usePrefix('divider')
  const className = useClass(name, props)

  const innerStyle = useMemo(() => {
    const prop = `margin${capitalize(orientation)}`
    return { [prop]: orientationMargin }
  }, [orientation, orientationMargin])

  return (
    <div
      className={className}
      {...attrs}
    >
      {children && (
        <span
          className={`${name}__inner-text`}
          style={innerStyle}
        >
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
