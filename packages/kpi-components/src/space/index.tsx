import { withDefaults } from '@kpi-ui/internal'
import { useConstant } from '@kpi-ui/hooks'
import { flattenChildren, omit } from '@kpi-ui/utils'
import { Fragment, ReactElement, type CSSProperties } from 'react'
import { usePrefixCls } from '../_internal/hooks'
import { detectFlexGap } from '../_internal/utils'
import useClass from './hooks/use_class'
import useSpaceGutter from './hooks/use_space_gutter'

import type { SpaceProps } from './props'

const excluded = ['children', 'size', 'style', 'direction', 'wrap', 'split'] as const

function Space(props: SpaceProps) {
  const { children: $children, size, style, direction, wrap, split } = props

  const gapSupport = useConstant(detectFlexGap)

  const name = usePrefixCls('space')

  const className = useClass(name, props)

  // 水平 垂直 间距
  const [hGutter, vGutter] = useSpaceGutter(size, !!split)

  // 垂直排列
  const vertical = direction === 'vertical'

  const wrapGapStyle: CSSProperties = {}
  if (gapSupport) {
    wrapGapStyle.rowGap = vGutter
    wrapGapStyle.columnGap = hGutter
  } else if (wrap || vertical) {
    wrapGapStyle.marginBottom = -vGutter
  }

  // 处理 children
  const children = flattenChildren($children).map((child, index, childList) => {
    const isEndItem = childList.length - index === 1
    const marginRight = isEndItem || vertical ? undefined : hGutter
    const paddingBottom = wrap || vertical ? vGutter : undefined
    const gapStyle = gapSupport ? undefined : { marginRight, paddingBottom }
    const key = (child as ReactElement)?.key || index
    return (
      <Fragment key={key}>
        <div className={`${name}-item`} style={gapStyle}>
          {child}
        </div>
        {split && !isEndItem && (
          <span className={`${name}-item-split`} style={gapStyle}>
            {split}
          </span>
        )}
      </Fragment>
    )
  })

  const rest = omit(props, excluded)

  return (
    <div className={className} style={{ ...wrapGapStyle, ...style }} {...rest}>
      {children}
    </div>
  )
}

export default withDefaults(Space, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
} as const)
