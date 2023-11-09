import { CSSTransition } from '../../transition'
import { WaveProps } from './props'

export default function Wave(props: WaveProps) {
  const { when } = props
  return (
    <CSSTransition when={when} name="kpi-wave">
      <span></span>
    </CSSTransition>
  )
}
