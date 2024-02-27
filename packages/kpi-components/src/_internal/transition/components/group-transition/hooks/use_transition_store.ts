import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { addClassNames, delClassNames, omit } from '@kpi-ui/utils'
import { cloneElement, createElement, useEffect, useMemo, type ReactElement } from 'react'
import { batch, reflow } from '../../../_shared/utils'
import { ENTER, isExit, isExited } from '../../../constants'
import makeUniqueId from '../../../utils/unique_id'
import CSSTransition from '../../css-transition'
import diff from '../utils/diff'
import union from '../utils/union'
// types
import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

const uniqueId = makeUniqueId('gt-')

class TransitionState<E extends HTMLElement> {
  constructor(props: Group<E>) {
    this.props = props

    this.previous = props.children

    this.current = props.children

    this.current.forEach((el) => {
      this.elements.set(el.key, { fresh: true, el: this.makeElement(el, { when: true }) })
    })
  }

  isInitial = true

  props: Group<E>

  previous: ReactElement[] = []

  current: ReactElement[] = []

  elements = new Map<ReactElement['key'], { el: ReactElement<CSS>; fresh: boolean }>()

  components = new Map<ReactElement['key'], CSSTransitionRef>()

  coords = new Map<ReactElement['key'], DOMRect>()

  cancels: (() => void)[] = []

  /** @internal */
  makeElement = (element: ReactElement, extra: Partial<CSS>) => {
    const preset = omit(this.props, ['children']) as CSS

    const ref = (instance: CSSTransitionRef | null) => {
      if (!instance) this.components.delete(element.key)
      else this.components.set(element.key, instance)
    }

    Object.assign(preset, extra, { key: uniqueId(), unmountOnExit: true, ref })

    return createElement(CSSTransition, preset, element)
  }
}

class TransitionAction<E extends HTMLElement> {
  constructor(private forceUpdate: () => void, private states: TransitionState<E>) {}

  injectLatestProps = (props: Group<E>) => {
    this.states.props = props
  }

  setIsInitial = (value: boolean) => {
    this.states.isInitial = value
  }

  isCanFlip = () => !!(this.states.props.name && this.states.props.flip)

  getCoords = () => {
    return this.states.previous.reduce((map, el) => {
      const comp = this.states.components.get(el.key)

      const rect = comp?.instance?.getBoundingClientRect()

      return rect ? map.set(el.key, rect) : map
    }, new Map<ReactElement['key'], DOMRect>())
  }

  runExitedEffect = () => {
    let isCompleted = true

    this.states.elements.forEach((_, key) => {
      const comp = this.states.components.get(key) || { status: ENTER }

      if (isExited(comp.status)) this.states.elements.delete(key)

      if (isCompleted && isExit(comp.status)) isCompleted = false
    })

    if (!isCompleted) return

    this.states.props.onExitComplete?.()

    this.forceUpdate()
  }

  unionElements = () => {
    const { children, onExited } = this.states.props

    const [enters, exits] = diff(this.states.current, children)

    this.states.elements = union(this.states.elements, enters, children).reduce(
      (result, [key, el]) => {
        if (result.has(key))
          throw new Error(`Encountered two children with the same key, '${key}'. `)

        if (enters.has(key)) {
          return result.set(key, {
            fresh: true,
            el: this.states.makeElement(el, { when: true, appear: true }),
          })
        }

        const props: Partial<CSS<E>> = { onExited: batch(onExited, this.runExitedEffect) }

        if (exits.has(key)) props.when = false

        return result.set(key, { fresh: props.when !== false, el: cloneElement(el, props) })
      },
      new Map()
    )

    this.states.previous = this.states.current

    this.states.current = children
  }

  setFlipCleanup = (value: (() => void)[]) => {
    this.states.cancels = value
  }

  runFlipCleanup = () => {
    // prettier-ignore
    this.states.cancels.forEach((fn) => { fn() })
  }

  shouldFlip = (isInitial: boolean) => !isInitial && this.isCanFlip()

  runFlip = () => {
    const { name } = this.states.props

    this.runFlipCleanup()

    const moves: (() => () => void)[] = []

    this.getCoords().forEach((newCoord, key) => {
      const oldCoord = this.states.coords.get(key)

      const dom = (this.states.components.get(key) || {}).instance

      if (!oldCoord || !dom) return

      const dx = oldCoord.left - newCoord.left

      const dy = oldCoord.top - newCoord.top

      if (!dx && !dy) return

      const oldTransform = dom.style.transform
      const oldDuration = dom.style.transitionDuration

      dom.style.transform = `translate(${dx}px, ${dy}px)`
      dom.style.transitionDuration = '0s'

      moves.push(() => {
        addClassNames(dom, name && `${name}-move`)

        dom.style.transform = oldTransform
        dom.style.transitionDuration = oldDuration

        const handler = () => {
          delClassNames(dom, name && `${name}-move`)
          dom.removeEventListener('transitionend', handler)
        }

        dom.addEventListener('transitionend', handler)

        return handler
      })
    })

    reflow()

    this.setFlipCleanup(moves.map((fn) => fn()))
  }

  renderNodes = () => {
    const { children } = this.states.props

    const elements: ReactElement[] = []

    // sync elements
    this.states.elements.forEach((item, key) => {
      const node = children.find((el) => el.key === key)

      if (!item.fresh || !node) return elements.push(item.el)

      const element = cloneElement(item.el, undefined, node)

      elements.push(element)

      this.states.elements.set(key, { fresh: item.fresh, el: element })
    })

    return elements
  }

  updateElements = () => {
    this.unionElements()

    this.forceUpdate()
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TransitionState(props))

  const actions = useMemo(() => new TransitionAction(forceUpdate, states), [forceUpdate, states])

  actions.injectLatestProps(props)

  useEffect(() => actions.runFlipCleanup, [actions])

  return { states, actions }
}
