import cls from 'classnames'
import { memo, useMemo } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { FormErrorListContext } from '../../../_internal/context'
import { useDebounceValue } from '../../../_internal/hooks'
import type { ErrorListProps } from '../../props'

function ErrorList(props: ErrorListProps) {
  const { prefixCls } = FormErrorListContext.useState()

  const { className, help, helpStatus } = props

  const errors = useDebounceValue(10, props.errors ?? [])
  const warnings = useDebounceValue(10, props.warnings ?? [])

  // const transitionList = useMemo(() => {
  //   return errors.concat(warnings)
  // }, [errors, warnings])

  // TODO: 优化过渡效果
  return (
    <div className={cls(`${prefixCls}__control-status`, className)}>
      {errors.map((error) => {
        return (
          <CSSTransition key={error} timeout={500} classNames="my-node">
            <div>{error}</div>
          </CSSTransition>
        )
      })}
    </div>
  )
}

export default memo(ErrorList)
