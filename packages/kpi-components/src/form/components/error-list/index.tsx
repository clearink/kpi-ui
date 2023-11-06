import { useDebounceValue } from '@kpi-ui/hooks'
import cls from 'classnames'
import { useMemo } from 'react'
import { usePrefixCls } from '../../../_internal/hooks'
import { GroupTransition } from '../../../transition'
import { makeErrorEntity } from '../../utils/error'
import handlers from '../../utils/handlers'

import type { ErrorListProps } from '../../props'

function ErrorList(props: ErrorListProps) {
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
    <div className={cls(prefixCls, className)}>
      <GroupTransition name="kpi-1err-list" appear onExitComplete={onExitComplete} {...handlers}>
        {transitionList.map((item) => {
          return (
            <div key={item.key} className={cls({ [`${prefixCls}--${item.status}`]: item.status })}>
              {item.error}
            </div>
          )
        })}
      </GroupTransition>
    </div>
  )
}

export default ErrorList
