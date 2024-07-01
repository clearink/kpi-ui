import { CSSTransition } from '_shared/components'
import { usePrefixCls } from '_shared/hooks'
import { withDisplayName } from '@kpi-ui/utils'

import { NaturalList } from '../../constants'
import useScrollNumberStore from './hooks/use_scroll_number_store'
import type { ScrollNumberProps } from './props'

function ScrollNumber(props: ScrollNumberProps) {
  const { char } = props

  const prefixCls = usePrefixCls('badge-scroll-number')

  const { returnEarly, states, action } = useScrollNumberStore(props)

  if (returnEarly) return null

  if (states.showRawChar) return <span>{char}</span>

  return (
    <CSSTransition
      key={char}
      when
      appear
      name={`${prefixCls}-motion`}
      onEnter={action.onEnter}
      onEntering={action.onEntering}
      onEntered={action.onEntered}
    >
      <span ref={states.$wrap} className={prefixCls}>
        {NaturalList.map((natural) => (
          <span
            key={natural}
            ref={(el) => {
              action.setItem(`${natural}`, el)
            }}
          >
            {natural}
          </span>
        ))}
      </span>
    </CSSTransition>
  )
}

export default withDisplayName(ScrollNumber)
