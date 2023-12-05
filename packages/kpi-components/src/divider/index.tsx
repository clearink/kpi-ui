import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'

import type { DividerProps } from './props'
import { useMemo } from 'react'

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

  const innerStyle = useMemo(() => {
    if (orientation === 'left') return { marginLeft: orientationMargin }
    if (orientation === 'right') return { marginRight: orientationMargin }
  }, [orientation, orientationMargin])

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={classes} {...attrs}>
      {children && (
        <span className={`${prefixCls}__inner-text`} style={innerStyle}>
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
})
