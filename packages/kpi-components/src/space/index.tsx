import { useConstant } from '@kpi-ui/hooks'
import { flattenChildren, withoutProperties } from '@kpi-ui/utils'
import { Fragment, ReactElement, type CSSProperties } from 'react'
import { usePrefixCls } from '../_internal/hooks'
import { withDefaults } from '../_internal/utils'
import useClass from './hooks/use_class'
import useSpaceGutter from './hooks/use_space_gutter'

import type { SpaceProps } from './props'

const excluded = ['children', 'size', 'style', 'direction', 'wrap', 'split'] as const

function Space(props: SpaceProps) {
  const { children: $children, size, style, split } = props

  const name = usePrefixCls('space')

  const className = useClass(name, props)

  // 水平 垂直 间距
  const [hGutter, vGutter] = useSpaceGutter(size, !!split)

  const wrapGapStyle: CSSProperties = { rowGap: vGutter, columnGap: hGutter }

  // 处理 children
  const children = flattenChildren($children).map((child, index, childList) => {
    const isEndItem = childList.length - index === 1
    const key = (child as ReactElement)?.key || index
    return (
      <Fragment key={key}>
        <div className={`${name}-item`}>{child}</div>
        {split && !isEndItem && <span className={`${name}-item-split`}>{split}</span>}
      </Fragment>
    )
  })

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={className} style={{ ...wrapGapStyle, ...style }} {...attrs}>
      {children}
    </div>
  )
}

export default withDefaults(Space, {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
} as const)
