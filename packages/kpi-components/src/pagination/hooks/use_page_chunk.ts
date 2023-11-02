import { PaginationProps } from '../props'

// 对分页数据切片
export default function usePageChunk(props: PaginationProps) {
  const { total, current, defaultCurrent, pageSize, defaultPageSize } = props
  const $current = current ?? defaultCurrent
  const $pageSize = pageSize ?? defaultPageSize
  const count = Number(total) / Number($pageSize)
  return [$current, Number.isNaN(count) ? 0 : count] as const
}
