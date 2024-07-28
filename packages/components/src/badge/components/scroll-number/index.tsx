import { CSSTransition } from '@comps/_shared/components'
import { usePrefixCls } from '@comps/_shared/hooks'
import { attachDisplayName } from '@comps/_shared/utils'

import type { ScrollNumberProps } from './props'

import { naturalList } from '../../constants'
import useScrollNumberStore from './hooks/use_scroll_number_store'

function ScrollNumber(props: ScrollNumberProps) {
  const { char } = props

  const prefixCls = usePrefixCls('badge-scroll-number')

  const { actions, returnEarly, states } = useScrollNumberStore(props)

  if (returnEarly) return null

  if (states.showRawChar) return <>{char}</>

  return (
    <CSSTransition
      key={char}
      appear
      when
      name={`${prefixCls}-motion`}
      onEnter={actions.handleEnter}
      onEntered={actions.handleEntered}
      onEntering={actions.handleEntering}
    >
      <span ref={states.$wrap} className={prefixCls}>
        {naturalList.map(natural => (
          <span
            key={natural}
            ref={(el) => { actions.setItem(natural, el) }}
          >
            {natural}
          </span>
        ))}
      </span>
    </CSSTransition>
  )
}

attachDisplayName(ScrollNumber)

export default ScrollNumber
