import { cls } from '@kpi-ui/utils'
import { GroupTransition } from '_shared/components'
import { usePrefixCls } from '_shared/hooks'

import type { FormErrorListProps } from './props'

import useFormatExplains from './hooks/use_format_explains'
import handlers from './utils/transition_handlers'

export default function FormErrorList(props: FormErrorListProps) {
  const { className, onExitComplete } = props

  const prefixCls = usePrefixCls('form-item-message')

  const explains = useFormatExplains(props)

  return (
    <GroupTransition
      appear
      className={cls(prefixCls, className)}
      name={`${prefixCls}-error`}
      onExitComplete={onExitComplete}
      tag="div"
      {...handlers}
    >
      {explains.map(item => (
        <div
          className={cls({
            [`${prefixCls}--${item.status}`]: item.status,
          })}
          key={item.key}
        >
          {item.value}
        </div>
      ))}
    </GroupTransition>
  )
}
