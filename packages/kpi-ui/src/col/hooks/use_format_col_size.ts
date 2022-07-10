import { useEffect, useMemo } from 'react'
import { useBreakpoint } from '../../_hooks'
import { BREAKPOINT_NAME } from '../../_shard/constant'
import { hasOwn } from '../../_utils'
import { ColProps } from '../props'

export default function useFormatColSize(props: ColProps) {
  const { flex, offset, order, pull, push, span } = props
  const breakpoint = useBreakpoint()
  const points = useMemo(() => {
    return BREAKPOINT_NAME.filter((point) => hasOwn(props, point))
  }, [props])

  // 格式化
}
