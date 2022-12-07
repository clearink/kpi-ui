import { usePrefix } from '@hooks'
import { withDefaultProps } from '@hocs'
import useClass from './hooks/use_class'
import usePageChunk from './hooks/use_page_chunk'
import { PaginationProps } from './props'

function Pagination(props: PaginationProps) {
  const { simple } = props
  const name = usePrefix('pagination')
  const className = useClass(name, props)

  const [current, chunkCount] = usePageChunk(props)

  // 渲染 prev list next size jumper

  if (simple) {
    return <div className={className}>pagination</div>
  }
  return <div className={className}>pagination</div>
}

export default withDefaultProps(Pagination, {
  simple: false,
  total: 0,
  showJumper: false,
  showHtmlTitle: true,
  hideOnSinglePage: false,
  defaultCurrent: 1,
  defaultPageSize: 10,
  itemRender: (_, __, element) => element,
  totalBoundaryShowSizeChanger: 50,
} as const)
