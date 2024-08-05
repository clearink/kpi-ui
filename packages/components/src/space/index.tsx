import { ConfigContext } from '@comps/_shared/contexts'
import { usePrefixCls } from '@comps/_shared/hooks'
import { attachDisplayName, flattenChildren, withDefaults } from '@comps/_shared/utils'
import { fallback, omit } from '@internal/utils'
import { type CSSProperties, Fragment, type ReactElement } from 'react'

import useFormatClass from './hooks/use_format_class'
import useSpaceGutter from './hooks/use_space_gutter'
import { type SpaceProps, defaultSpaceProps } from './props'

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

function Space(_props: SpaceProps) {
  const { space } = ConfigContext.useState()

  const props = withDefaults(_props, {
    ...defaultSpaceProps,
    size: fallback(space?.size, defaultSpaceProps.size),
  })

  const { children, size, split, style } = props

  const prefixCls = usePrefixCls('space')

  const classes = useFormatClass(prefixCls, props)

  // 水平 垂直 间距
  const [h, v] = useSpaceGutter(size, !!split)

  const gap: CSSProperties = { columnGap: h, rowGap: v }

  // 处理 children
  const renderNode = flattenChildren(children).map((child, index, childList) => {
    const isEndItem = childList.length - index === 1
    const key = (child as ReactElement)?.key || index
    return (
      <Fragment key={key}>
        <div className={`${prefixCls}-item`}>{child}</div>
        {!!split && !isEndItem && (
          <span className={`${prefixCls}-item-split`}>
            {split}
          </span>
        )}
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

attachDisplayName(Space)

export default Space
