import { withDefaults } from '@kpi-ui/utils'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import usePageChunk from './hooks/use_page_chunk'

import type { PaginationProps } from './props'
import { LayoutGroup, LayoutTransition } from '../transition'

function Pagination(props: PaginationProps) {
  const { onChange } = props

  const prefixCls = usePrefixCls('pagination')

  const classes = useFormatClass(prefixCls, props)

  const [current, chunkCount] = usePageChunk(props)

  // 渲染 prev list next size jumper

  return (
    <LayoutGroup
      tag="div"
      className={classes}
      onEnter={({ el, offset, scale }) => {
        el.style.transform = `translate3d(${offset[0]}px, ${offset[1]}px, 0) scale(${scale[0]}, ${scale[1]})`
      }}
      onEntering={(el) => {
        el.style.transform = `translate3d(0, 0, 0) scale(1, 1)`
        el.style.transition = `transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`
      }}
      onEntered={(el) => {
        el.style.transform = ''
        el.style.transition = ''
      }}
    >
      {Array.from({ length: chunkCount }, (_, i) => {
        return (
          <div
            key={i}
            className={`${prefixCls}__item`}
            onClick={() => {
              onChange && onChange(i + 1, 10)
            }}
          >
            <a className={`${prefixCls}__text`} rel="nofollow">
              {['你好', 'hello world'][i % 2]}
            </a>
            {current === i + 1 && (
              <LayoutTransition id="pagination">
                <div className={`${prefixCls}__active`}></div>
              </LayoutTransition>
            )}
          </div>
        )
      })}
    </LayoutGroup>
  )
}

export default withDefaults(Pagination, {
  simple: false,
  total: 0,
  showJumper: false,
  showHtmlTitle: true,
  hideOnSinglePage: false,
  defaultCurrent: 1,
  defaultPageSize: 10,
  totalBoundaryShowSizeChanger: 50,
} as const)
