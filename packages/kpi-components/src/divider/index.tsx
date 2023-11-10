import { capitalize, withDefaults, withoutProperties } from '@kpi-ui/utils'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'

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

  const prefixCls = usePrefixCls('divider')

  const classes = useFormatClass(prefixCls, props)

  const innerStyle = { [`margin${capitalize(orientation)}`]: orientationMargin }

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={classes} {...attrs}>
      {children && (
        <span className={`${name}__inner-text`} style={innerStyle}>
          {children}
        </span>
      )}
    </div>
  )
}

export default withDefaults(Divider, {
  dashed: false,
  orientation: 'center',
  plain: false,
  type: 'horizontal',
} as const)
