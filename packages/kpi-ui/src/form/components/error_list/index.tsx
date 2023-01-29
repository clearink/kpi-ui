import cls from 'classnames'
import { useMemo } from 'react'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { useDebounceValue } from '@kpi/shared'
import { usePrefixCls } from '../../../_internal/hooks'
import type { ErrorListProps } from '../../props'
import { makeErrorEntity } from '../../utils/error'

function ErrorList(props: ErrorListProps) {
  const { className, onExitComplete, help, helpStatus } = props

  const prefixCls = usePrefixCls('form-item-message')

  const errors = useDebounceValue(10, props.errors ?? [])
  const warnings = useDebounceValue(10, props.warnings ?? [])

  const transitionList = useMemo(() => {
    if (help) return [makeErrorEntity(help, helpStatus, 'help')]

    return [
      ...errors.map((error, index) => makeErrorEntity(error, 'error', 'error', index)),
      ...warnings.map((warning, index) => makeErrorEntity(warning, 'warning', 'warning', index)),
    ]
  }, [errors, help, helpStatus, warnings])

  return (
    <div className={cls(prefixCls, className)}>
      <LazyMotion features={domAnimation}>
        <AnimatePresence onExitComplete={onExitComplete}>
          {transitionList.map((item) => {
            return (
              <m.div
                key={item.key}
                className={cls({ [`${prefixCls}--${item.status}`]: item.status })}
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
              >
                {item.error}
              </m.div>
            )
          })}
        </AnimatePresence>
      </LazyMotion>
    </div>
  )
}

export default ErrorList
