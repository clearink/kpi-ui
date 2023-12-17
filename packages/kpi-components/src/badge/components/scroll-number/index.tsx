import { useMemo } from 'react'
import { GroupTransition } from '../../../transition'
import { usePrefixCls } from '../../../_shared/hooks'
import { min } from '../../../_shared/utils'

import type { ScrollNumberProps } from './props'

export default function ScrollNumber(props: ScrollNumberProps) {
  const { value, max } = props

  const prefixCls = usePrefixCls('badge')

  const list = useMemo(() => {
    const chars = String(min([value, max])).split('')

    if (value > max) chars.push('+')

    return chars.map((value, index) => ({ key: `${index}-${value}`, value }))
  }, [value, max])

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
