import { useMemo } from 'react'
import { GroupTransition } from '../../../_internal/transition'
import { usePrefixCls } from '../../../_shared/hooks'
import { min } from '../../../_shared/utils'

import type { ScrollNumberProps } from './props'

export default function ScrollNumber(props: ScrollNumberProps) {
  const { value, maxCount } = props

  const prefixCls = usePrefixCls('badge')

  const list = useMemo(() => {
    const chars = String(min([value, maxCount])).split('')

    if (value > maxCount) chars.push('+')

    // TODO: key 需要记录上次的值
    return chars.map((value, index) => ({ key: `${index}-${value}`, value }))
  }, [value, maxCount])

  return (
    <GroupTransition name={`${prefixCls}-scroll-number`} flip>
      {list.map((item) => (
        <span key={item.key} className={`${prefixCls}__scroll-number`}>
          {item.value}
        </span>
      ))}
    </GroupTransition>
  )
}
