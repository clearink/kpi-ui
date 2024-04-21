import { cls } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import useFormatExplains from './hooks/use_format_explains'
import handlers from './utils/transition_handlers'
// comps
import { GroupTransition } from '../../../_internal/transition'
// types
import type { FormErrorListProps } from './props'

export default function FormErrorList(props: FormErrorListProps) {
  const { className, onExitComplete } = props

  const prefixCls = usePrefixCls('form-item-message')

  const explains = useFormatExplains(props)

  return (
    <GroupTransition
      tag="div"
      className={cls(prefixCls, className)}
      name={`${prefixCls}-error`}
      appear
      onExitComplete={onExitComplete}
      {...handlers}
    >
      {explains.map((item) => (
        <div
          key={item.key}
          className={cls({
            [`${prefixCls}--${item.status}`]: item.status,
          })}
        >
          {item.value}
        </div>
      ))}
    </GroupTransition>
  )
}
