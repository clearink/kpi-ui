import { capitalize, omit } from '@kpi/shared'
import { withDefaultProps } from '@kpi/internal'
import { usePrefixCls } from '../_internal/hooks'
import useClass from './hooks/use_class'

import type { DividerProps } from './props'

const excluded = [
  'children',
  'orientation',
  'orientationMargin',
  'className',
  'type',
  'dashed',
  'plain',
] as const

function Divider(props: DividerProps) {
  const { children, orientation, orientationMargin } = props

  const name = usePrefixCls('divider')

  const className = useClass(name, props)

  const innerStyle = { [`margin${capitalize(orientation)}`]: orientationMargin }

  const attrs = omit(props, excluded)

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
