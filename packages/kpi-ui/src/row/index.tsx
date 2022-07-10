import { Children, cloneElement, CSSProperties, isValidElement, useMemo } from 'react'
import { useFlexGapSupport, usePrefix } from '../_hooks'
import { withDefault } from '../_utils'
import useRowClass from './hooks/use_row_class'
import useRowGutter from './hooks/use_row_gutter'
import { RowProps } from './props'

function Row(props: RowProps) {
  const { children: $children, style: $style, gutter } = props
  const name = usePrefix('row')
  const className = useRowClass(name, props)
  const gapSupport = useFlexGapSupport()
  const [XGap, YGap] = useRowGutter(gutter)

  const children = useMemo(() => {
    const gap = XGap / 2
    let gapStyle: CSSProperties = { paddingLeft: gap, paddingRight: gap }
    if (!gapSupport) gapStyle = { ...gapStyle, marginBottom: YGap }
    return Children.map($children, (child) => {
      if (!isValidElement(child)) return child
      const style = { ...gapStyle, ...child.props.style }
      return cloneElement(child, { style })
    })
  }, [$children, XGap, YGap, gapSupport])

  const style = useMemo(() => {
    const gap = -XGap / 2
    let gapStyle: CSSProperties = { marginLeft: gap, marginRight: gap }
    if (gapSupport) gapStyle = { ...gapStyle, rowGap: YGap }
    else gapStyle = { ...gapStyle, marginBottom: -YGap }
    return { ...gapStyle, ...$style }
  }, [gapSupport, XGap, YGap, $style])

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

export default withDefault(Row, {
  gutter: 0,
  wrap: true,
} as const)
