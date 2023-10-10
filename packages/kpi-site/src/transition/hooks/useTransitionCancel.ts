import { useEvent } from '@kpi/shared'
import { delClassName } from '../utils/classnames'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'
import { resetFinishProp } from '../utils/symbol'

import type { TransitionProps, TransitionStep } from '../props'

export default function useTransitionCancel<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { onEnterCancel, onExitCancel } = props

  return useEvent((el: E, step: TransitionStep) => {
    delClassName(el, classNames[step].from)
    delClassName(el, classNames[step].active)
    delClassName(el, classNames[step].to)

    // TODO:
    resetFinishProp(el)

    if (step === 'exit') onExitCancel && onExitCancel(el)
    else onEnterCancel && onEnterCancel(el, store.appearing)
  })
}
