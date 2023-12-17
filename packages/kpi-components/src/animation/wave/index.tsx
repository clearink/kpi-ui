import { usePrefixCls } from '../../_shared/hooks'
import { CSSTransition } from '../../transition'

import type { WaveProps } from './props'

export default function Wave(props: WaveProps) {
  const { when, children } = props

  const name = usePrefixCls('wave')

  return (
    <CSSTransition when={when} name={name}>
      {children}
    </CSSTransition>
  )
}
