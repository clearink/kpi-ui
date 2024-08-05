import { styledAttrs } from '@comps/_shared/constants'
import { usePrefixCls } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { isNullish, omit } from '@internal/utils'
import { useMemo } from 'react'

import useFormatClass from './hooks/use_format_class'
import { type DividerProps, defaultDividerProps } from './props'

const excluded = [
  'children',
  'dashed',
  'align',
  'margin',
  'plain',
  'direction',
  ...styledAttrs,
] as const

function Divider(_props: DividerProps) {
  const props = withDefaults(_props, defaultDividerProps)

  const { align, children, direction, margin } = props

  const prefixCls = usePrefixCls('divider')

  const classes = useFormatClass(prefixCls, props)

  const innerStyle = useMemo(() => {
    if (align === 'left') return { marginLeft: margin }
    if (align === 'right') return { marginRight: margin }
  }, [align, margin])

  const attrs = omit(props, excluded)

  return (
    <div {...attrs} className={classes}>
      {direction === 'horizontal' && !isNullish(children) && (
        <span className={`${prefixCls}__inner-text`} style={innerStyle}>
          {children}
        </span>
      )}
    </div>
  )
}

attachDisplayName(Divider)
export default Divider
