import { fallback } from '@kpi-ui/utils'
import { useMemo } from 'react'

import { PaginationProps } from '../props'

// 对分页数据切片
export default function usePageChunk(props: PaginationProps) {
  const { total, defaultCurrent, current: _current, defaultPageSize, pageSize: _pageSize } = props

  return useMemo(() => {
    const current = fallback(_current, defaultCurrent)!

    const pageSize = fallback(_pageSize, defaultPageSize)!

    const count = Number(total) / Number(pageSize)

    return [current, Number.isNaN(count) ? 0 : count] as const
  }, [_current, _pageSize, defaultCurrent, defaultPageSize, total])
}
