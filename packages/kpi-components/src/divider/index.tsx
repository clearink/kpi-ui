import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { useMemo } from 'react'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'

import type { DividerProps } from './props'

const excluded = ['children', 'dashed', 'align', 'margin', 'plain', 'direction'] as const

function Divider(props: DividerProps) {
  const { children, direction, align, margin } = props

  const prefixCls = usePrefixCls('divider')

  const classes = useFormatClass(prefixCls, props)

  const innerStyle = useMemo(() => {
    if (align === 'left') return { marginLeft: margin }
    if (align === 'right') return { marginRight: margin }
  }, [align, margin])

  const attrs = withoutProperties(props, excluded)

  return (
    <div {...attrs} className={classes}>
      {direction === 'horizontal' && children && (
        <span className={`${prefixCls}__inner-text`} style={innerStyle}>
          {children}
        </span>
      )}
    </div>
  )
}

export default withDefaults(Divider, {
  dashed: false,
  align: 'center',
  direction: 'horizontal',
  plain: false,
})
