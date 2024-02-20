// utils
import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { omit } from '@kpi-ui/utils'
import { ReactElement, cloneElement, createElement } from 'react'
import { batch } from '../../../_shared/utils'
import runCounter from '../../../utils/run_counter'
import makeUniqueId from '../../../utils/unique_id'
// comps
import CSSTransition from '../../css-transition'
// types
import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { SwitchTransitionProps as Switch } from '../props'

const uniqueId = makeUniqueId('st-')
class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Switch<E>) {
    this.props = props

    this.current = props.children

    this.elements = [{ fresh: true, el: this.make(this.current, { when: true }) }]
  }

  props: Switch<E>

  current: ReactElement

  elements: { el: ReactElement; fresh: boolean }[] = []

  setTransitionProps = (props: Switch<E>) => {
    this.props = props
  }

  make = (element: ReactElement, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['mode', 'children']) as CSS

    Object.assign(preset, extra, { key: uniqueId() })

    return createElement(CSSTransition, preset, element)
  }

  runOutInSwitch = () => {
    this.elements = [
      {
        fresh: false,
        el: cloneElement(this.elements[0].el, {
          when: false,
          appear: true,
          onExited: batch(this.props.onExited, () => {
            this.current = this.props.children

            this.elements = [
              {
                fresh: true,
                el: this.make(this.current, { when: true, appear: true }),
              },
            ]

            this.forceUpdate()
          }),
        }),
      },
    ]
  }

  runInOutSwitch = () => {
    this.current = this.props.children

    this.elements = [
      {
        fresh: false,
        el: cloneElement((this.elements[1] || this.elements[0]).el, {
          onEntered: this.props.onEntered,
          onExited: this.props.onExited,
        }),
      },
      {
        fresh: true,
        el: this.make(this.current, {
          when: true,
          appear: true,
          onEntered: batch(this.props.onEntered, () => {
            this.elements = [
              {
                fresh: false,
                el: cloneElement(this.elements[0].el, {
                  when: false,
                  onExited: batch(this.props.onExited, () => {
                    this.elements = [this.elements[1]]
                    this.forceUpdate()
                  }),
                }),
              },
              this.elements[1],
            ]
            this.forceUpdate()
          }),
        }),
      },
    ]
  }

  runDefaultSwitch = () => {
    this.current = this.props.children

    const resolve = runCounter(2, () => {
      this.elements = [this.elements[1]]
      this.forceUpdate()
    })

    this.elements = [
      {
        fresh: false,
        el: cloneElement((this.elements[1] || this.elements[0]).el, {
          when: false,
          appear: true,
          onEntered: this.props.onEntered,
          onExited: batch(this.props.onExited, resolve),
        }),
      },
      {
        fresh: true,
        el: this.make(this.current, {
          when: true,
          appear: true,
          onEntered: batch(this.props.onEntered, resolve),
        }),
      },
    ]
  }

  render = () => {
    const { children } = this.props

    // updateElements
    this.elements = this.elements.map((item) => {
      if (!item.fresh) return item

      return { fresh: item.fresh, el: cloneElement(item.el, undefined, children) }
    })

    return this.elements.map((item) => item.el)
  }
}
export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Switch<E>) {
  const forceUpdate = useForceUpdate()

  const store = useConstant(() => new TransitionStore(forceUpdate, props))

  store.setTransitionProps(props)

  return store
}
