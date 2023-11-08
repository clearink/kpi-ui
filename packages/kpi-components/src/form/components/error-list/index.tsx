import { useDebounceValue } from '@kpi-ui/hooks'
import cls from 'classnames'
import { useMemo } from 'react'
import { usePrefixCls } from '../../../_shared/hooks'
import { GroupTransition } from '../../../transition'
import { makeErrorEntity } from '../../utils/error'
import handlers from '../../utils/handlers'

import type { FormErrorListProps } from './props'

export default function FormErrorList(props: FormErrorListProps) {
  const { className, onExitComplete, help, helpStatus } = props

  const prefixCls = usePrefixCls('form-item-message')

  const errors = useDebounceValue(20, props.errors || [])

  const warnings = useDebounceValue(20, props.warnings || [])

  const transitionList = useMemo(() => {
    if (help) return [makeErrorEntity(help, helpStatus, 'help')]

    return [
      ...errors.map((error, index) => makeErrorEntity(error, 'error', 'error', index)),
      ...warnings.map((warning, index) => makeErrorEntity(warning, 'warning', 'warning', index)),
    ]
  }, [errors, help, helpStatus, warnings])

  return (
    <GroupTransition
      tag="div"
      className={cls(prefixCls, className)}
      name="kpi-form-error"
      appear
      onExitComplete={onExitComplete}
      {...handlers}
    >
      {transitionList.map((item) => {
        return (
          <div key={item.key} className={cls({ [`${prefixCls}--${item.status}`]: item.status })}>
            {item.error}
          </div>
        )
      })}
    </GroupTransition>
  )
}
