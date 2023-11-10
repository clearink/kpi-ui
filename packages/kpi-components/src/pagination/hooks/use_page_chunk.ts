import { fallback } from '@kpi-ui/utils'
import { PaginationProps } from '../props'
import { useMemo } from 'react'

// 对分页数据切片
export default function usePageChunk(props: PaginationProps) {
  const { total, current: _current, defaultCurrent, pageSize: _pageSize, defaultPageSize } = props

  return useMemo(() => {
    const current = fallback(_current, defaultCurrent)

    const pageSize = fallback(_pageSize, defaultPageSize)

    const count = Number(total) / Number(pageSize)

    return [current, Number.isNaN(count) ? 0 : count] as const
  }, [_current, _pageSize, defaultCurrent, defaultPageSize, total])
}
