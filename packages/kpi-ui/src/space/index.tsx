import { useMemo, Children } from 'react'
import { withDefault } from '../_utils'
import { useFlexGapSupport, usePrefix } from '../_hooks'
import useSpaceGutter from './hooks/use_space_gutter'
import useSpaceClass from './hooks/use_space_class'
import { SpaceProps } from './props'

function Space(props: SpaceProps) {
  const { children: $children, size, style: $style, direction, wrap, split, ...rest } = props

  // 是否支持 gap 属性
  const gapSupport = useFlexGapSupport()

  const name = usePrefix('space')
  const className = useSpaceClass(name, props)
  // 水平 垂直 间距
  const [hGutter, vGutter] = useSpaceGutter(size, !!split)

  // 垂直排列
  const vertical = direction === 'vertical'

  const style = useMemo(() => {
    let gapStyle = {}
    if (gapSupport) gapStyle = { rowGap: vGutter, columnGap: hGutter }
    else if (wrap || vertical) gapStyle = { marginBottom: -vGutter }
    return Object.assign(gapStyle, $style)
  }, [$style, hGutter, vGutter, gapSupport, wrap, vertical])

  // 处理 children
  const children = useMemo(() => {
    const count = Children.count($children)
    return Children.map($children, (child, index) => {
      const isEndItem = count - index === 1
      const marginRight = isEndItem || vertical ? undefined : hGutter
      const paddingBottom = wrap || vertical ? vGutter : undefined
      const gapStyle = gapSupport ? undefined : { marginRight, paddingBottom }
      return (
        <>
          <div className={`${name}-item`} style={gapStyle}>
            {child}
          </div>
          {split && !isEndItem && (
            <span className={`${name}-item-split`} style={gapStyle}>
              {split}
            </span>
          )}
        </>
      )
    })
  }, [$children, hGutter, vGutter, gapSupport, name, vertical, wrap, split])

  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  )
}

export default withDefault(Space, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
} as const)
