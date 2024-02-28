// utils
import { cls, loopFrame } from '@kpi-ui/utils'
import { GroupTransition } from '../../../_internal/transition'
import { usePrefixCls } from '../../../_shared/hooks'
import useFormatExplains from './hooks/use_format_explains'
import handlers from './utils/transition_handlers'
// types
import type { FormErrorListProps } from './props'
import { useEffect, useRef } from 'react'

export default function FormErrorList(props: FormErrorListProps) {
  const { className, onExitComplete } = props

  const prefixCls = usePrefixCls('form-item-message')

  const explains = useFormatExplains(props)

  // useEffect(() => {
  //   return loopFrame(() => {
  //     const els = document.querySelectorAll(
  //       '#root > div > div > div:nth-child(1) > div.kpi-col.kpi-form-item__control.kpi-form-item__control--has-error > div.kpi-form-item__control-status > div.kpi-form-item-message > div'
  //     )
  //     let total = 0

  //     els.forEach((el) => {
  //       total += el.getBoundingClientRect().height
  //     })
  //     console.log('total', total, els.length)
  //     return true
  //   })
  // }, [])
  return (
    <GroupTransition
      tag="div"
      className={cls(prefixCls, className)}
      name={`${prefixCls}-error`}
      appear
      onExitComplete={onExitComplete}
      {...handlers}
    >
      {explains.map((item, i) => (
        <div key={item.key} className={cls({ [`${prefixCls}--${item.status}`]: item.status })}>
          {item.value}
        </div>
      ))}
    </GroupTransition>
  )
}
