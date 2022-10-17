import { useMemo, Children, Fragment, ReactElement } from 'react'
import { withDefaultProps } from '../_hocs'
import { useFlexGapSupport, usePrefix } from '../_hooks'
import useSpaceGutter from './hooks/use_space_gutter'
import useClass from './hooks/use_class'
import { SpaceProps } from './props'
import { flattenChildren } from '../_utils'

function Space(props: SpaceProps) {
  const { children: $children, size, style: $style, direction, wrap, split, ...rest } = props

  // 是否支持 gap 属性
  const gapSupport = useFlexGapSupport()

  const name = usePrefix('space')
  const className = useClass(name, props)
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
    return flattenChildren($children).map((child, index, childList) => {
      const isEndItem = childList.length - index === 1
      const marginRight = isEndItem || vertical ? undefined : hGutter
      const paddingBottom = wrap || vertical ? vGutter : undefined
      const gapStyle = gapSupport ? undefined : { marginRight, paddingBottom }
      const key = (child as ReactElement)?.key || index
      return (
        <Fragment key={key}>
          <div
            className={`${name}-item`}
            style={gapStyle}
          >
            {child}
          </div>
          {split && !isEndItem && (
            <span
              className={`${name}-item-split`}
              style={gapStyle}
            >
              {split}
            </span>
          )}
        </Fragment>
      )
    })
  }, [$children, gapSupport, hGutter, name, split, vGutter, vertical, wrap])

  return (
    <div
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

export default withDefaultProps(Space, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
} as const)
