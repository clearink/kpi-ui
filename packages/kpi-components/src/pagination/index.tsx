import { withDefaults } from '@kpi-ui/utils'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import usePageChunk from './hooks/use_page_chunk'

import type { PaginationProps } from './props'

function Pagination(props: PaginationProps) {
  const { simple } = props

  const prefixCls = usePrefixCls('pagination')

  const classes = useFormatClass(prefixCls, props)

  const [current, chunkCount] = usePageChunk(props)

  // 渲染 prev list next size jumper

  if (simple) {
    return <div className={classes}>pagination</div>
  }
  return <div className={classes}>pagination</div>
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
