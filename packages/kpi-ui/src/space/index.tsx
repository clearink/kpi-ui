import { useMemo, Children } from 'react'
import { useFlexGapSupport, usePrefix } from '../_util/hooks'
import withDefaultProps from '../_util/hocs/withDefaultProps'
import useSpaceSize from './hooks/use_space_size'
import useSpaceClass from './hooks/use_space_class'
import { SpaceProps } from './props'
// 导出组件属性
export type { SpaceProps }

function Space(props: SpaceProps) {
  const { children: $children, size, style: $style, direction, wrap, split, ...rest } = props

  // 是否支持 gap 属性
  const canUseFlexGap = useFlexGapSupport()

  const name = usePrefix('space')
  const className = useSpaceClass(name, props)
  // 水平 垂直 间距
  const [XGap, YGap] = useSpaceSize(size, !!split)

  // 垂直排列
  const vertical = direction === 'vertical'

  const style = useMemo(() => {
    let gapStyle = {}
    if (canUseFlexGap) gapStyle = { rowGap: YGap, columnGap: XGap }
    else if (wrap || vertical) gapStyle = { marginBottom: -YGap }
    return Object.assign(gapStyle, $style)
  }, [$style, XGap, YGap, canUseFlexGap, wrap, vertical])

  // 处理 children
  const children = useMemo(() => {
    const count = Children.count($children)
    return Children.map($children, (child, index) => {
      const isEndItem = count - index === 1
      const marginRight = isEndItem || vertical ? undefined : XGap
      const paddingBottom = wrap || vertical ? YGap : undefined
      const gapStyle = canUseFlexGap ? undefined : { marginRight, paddingBottom }
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
  }, [$children, XGap, YGap, canUseFlexGap, name, vertical, wrap, split])

  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  )
}

export default withDefaultProps(Space, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
})
