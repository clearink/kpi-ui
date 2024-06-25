import { isNullish, omit, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls } from '_hooks'
import { useMemo } from 'react'
import useFormatClass from './hooks/use_format_class'
// types
import type { DividerProps } from './props'

const excluded = [
  'children',
  'dashed',
  'align',
  'margin',
  'plain',
  'direction',
  // 样式
  'className',
  'classNames',
  'style',
  'styles',
] as const

const defaultProps: Partial<DividerProps> = {
  dashed: false,
  align: 'center',
  direction: 'horizontal',
  plain: false,
}

function Divider(_props: DividerProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, direction, align, margin } = props

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

export default withDisplayName(Divider)
