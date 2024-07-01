import { ConfigContext } from '_shared/contexts'
import { usePrefixCls } from '_shared/hooks'
import { fallback, flattenChildren, omit, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { type CSSProperties, Fragment, type ReactElement } from 'react'

import useFormatClass from './hooks/use_format_class'
import useSpaceGutter from './hooks/use_space_gutter'
import type { SpaceProps } from './props'

const excluded = [
  'align',
  'direction',
  'size',
  'split',
  'wrap',
  'children',
  'split',
  'wrap',
] as const

const defaultProps: Partial<SpaceProps> = {
  direction: 'horizontal',
  size: 'small',
  wrap: false,
}

function Space(_props: SpaceProps) {
  const { space } = ConfigContext.useState()

  const props = withDefaults(_props, {
    ...defaultProps,
    size: fallback(space?.size, defaultProps.size),
  })

  const { children, style, split, size } = props

  const prefixCls = usePrefixCls('space')

  const classes = useFormatClass(prefixCls, props)

  // 水平 垂直 间距
  const [h, v] = useSpaceGutter(size, !!split)

  const gap: CSSProperties = { rowGap: v, columnGap: h }

  // 处理 children
  const renderNode = flattenChildren(children).map((child, index, childList) => {
    const isEndItem = childList.length - index === 1
    const key = (child as ReactElement)?.key || index
    return (
      <Fragment key={key}>
        <div className={`${prefixCls}-item`}>{child}</div>
        {split && !isEndItem && <span className={`${prefixCls}-item-split`}>{split}</span>}
      </Fragment>
    )
  })

  const attrs = omit(props, excluded)

  return (
    <div {...attrs} className={classes} style={{ ...gap, ...style }}>
      {renderNode}
    </div>
  )
}

export default withDisplayName(Space)
