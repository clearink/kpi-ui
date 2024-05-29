import { withDisplayName } from '@kpi-ui/utils'
import { useEffect } from 'react'
// comps
import { CSSTransition } from '../../../_internal/transition'
// types
import type { SegmentedThumbProps } from './props'

function SegmentedThumb(props: SegmentedThumbProps) {
  const { className, style, active, states, actions } = props

  useEffect(() => {
    console.log('active change', active, states)
    // 比对前后的
  }, [active, states])

  return (
    <CSSTransition
      when
      appear
      onEnter={() => {
        actions.setInTransition(true)
      }}
      onEnterCancel={() => {
        actions.setInTransition(false)
      }}
      onEntered={() => {
        actions.setInTransition(false)
      }}
    >
      <div className={className} style={style}></div>
    </CSSTransition>
  )
}
/**
 *         {states.inTransition && (
          <CSSTransition
            key={active}
            when
            appear={!states.isFirst}
            onEnter={(el, appearing) => {
              if (!appearing) return

              const p = states.history[0]

              if (!p) return

              const previous = states.items.get(p)
              const group = states.$group.current

              if (previous && group) {
                const precRect = previous.getBoundingClientRect()
                const groupRect = group.getBoundingClientRect()

                const delta = precRect.left - groupRect.left

                el.style.transform = `translate3d(${delta}px, 0, 0)`
                el.style.height = `${precRect.height}px`
                el.style.width = `${precRect.width}px`
              }
            }}
            onEntering={(el) => {
              const c = states.history[1]

              if (!c) return

              const current = states.items.get(c)
              const group = states.$group.current

              if (current && group) {
                const currRect = current.getBoundingClientRect()
                const groupRect = group.getBoundingClientRect()

                const delta = currRect.left - groupRect.left

                el.style.transform = `translate3d(${delta}px, 0, 0)`
                el.style.height = `${currRect.height}px`
                el.style.width = `${currRect.width}px`
                el.style.transition = `all .3s cubic-bezier(0.645, 0.045, 0.355, 1)`
              }
            }}
            onEntered={() => {
              actions.setInTransition(false)
            }}
            onExitCancel={() => {
              console.log('exit cancel')
            }}
            onExited={() => {
              console.log('exited')
            }}
          >
            <div className={classNames.thumb} style={styles.thumb}></div>
          </CSSTransition>
        )}
 */
export default withDisplayName(SegmentedThumb)
