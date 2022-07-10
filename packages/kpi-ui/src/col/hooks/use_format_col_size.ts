import { useMemo } from 'react'
import { useBreakpoint } from '../../_hooks'
import { BREAKPOINT_NAME } from '../../_shard/constant'
import { hasOwn } from '../../_utils'
import { ColProps } from '../props'
// TODO: 完成该 hooks!!!!!!!!!
export default function useFormatColSize(props: ColProps) {
  const { flex, offset, order, pull, push, span } = props
  const points = useMemo(() => {
    return BREAKPOINT_NAME.filter((point) => hasOwn(props, point))
  }, [props])
  const breakpoint = useBreakpoint()
  // 格式化
}
