import cls from 'classnames'
import { memo, useMemo, createRef } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'

import { FormErrorListContext } from '../../../_internal/context'
import { useDebounceValue } from '../../../_internal/hooks'
import type { ErrorListProps } from '../../props'

function ErrorList(props: ErrorListProps) {
  const { prefixCls } = FormErrorListContext.useState()

  const { className, help, helpStatus } = props

  const errors = useDebounceValue(10, props.errors ?? [])
  const warnings = useDebounceValue(10, props.warnings ?? [])

  const transitionList = useMemo(() => {
    return errors.concat(warnings).map((item) => {
      return { key: item, ref: createRef<HTMLDivElement>(), error: item }
    })
  }, [errors, warnings])

  // TODO: 优化过渡效果
  return (
    <div className={cls(`${prefixCls}__control-status`, className)}>
      {/* 负责处理高度过渡 */}
      {/* {hasError && <div className={`${prefixCls}__control-offset`} style={{ marginBottom: -24 }} />} */}
      {/* <Transition>

      </Transition> */}
      {/* 负责展示数据 */}
      <TransitionGroup component={null}>
        {transitionList.map(({ key, ref, error }) => {
          return (
            <Transition key={key} unmountOnExit nodeRef={ref} timeout={800}>
              {(state) => {
                // // eslint-disable-next-line no-debugger
                // debugger
                return <div ref={ref}>{error}</div>
              }}
            </Transition>
          )
        })}
      </TransitionGroup>
    </div>
  )
}

export default memo(ErrorList)
