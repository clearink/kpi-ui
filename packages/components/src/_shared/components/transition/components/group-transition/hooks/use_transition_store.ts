import { useConstant, useForceUpdate } from '_shared/hooks'
import { makeUniqueId } from '_shared/utils'
import { addClassNames, batch, delClassNames, pick, reflow } from '@kpi-ui/utils'
import { cloneElement, createElement, type ReactElement,useEffect, useMemo } from 'react'

import { ENTER, isExit, isExited } from '../../../constants'
import CSSTransition from '../../css-transition'
import type {
  CSSTransitionProps as CssProps,
  CSSTransitionRef as CssRef,
} from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'
import diff from '../utils/diff'
import union from '../utils/union'

const uniqueId = makeUniqueId('gt-')

const included = [
  'name',
  'type',
  'duration',
  'appear',
  'classNames',
  'addEndListener',
  'onEnter',
  'onEntering',
  'onEntered',
  'onEnterCancel',
  'onExit',
  'onExiting',
  'onExited',
  'onExitCancel',
] as const

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

  elements = new Map<ReactElement['key'], { el: ReactElement<CssProps>; fresh: boolean }>()

  components = new Map<ReactElement['key'], CssRef>()

  coords = new Map<ReactElement['key'], DOMRect>()

  cancels: (() => void)[] = []

  /** @internal */
  makeElement = (element: ReactElement, extra: Partial<CssProps>) => {
    const preset = pick(this.props, included) as CssProps

    const ref = (instance: CssRef | null) => {
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

  updateElements = () => {
    const { children, onExited } = this.states.props

    const [enters, exits] = diff(this.states.current, children)

    const allElements = union(this.states.elements, enters, children)

    this.states.elements = allElements.reduce((result, [key, el]) => {
      if (result.has(key)) throw new Error(`two children with the same key, '${key}'. `)

      // prettier-ignore
      if (enters.has(key)) return result.set(key, {
        fresh: true,
        el: this.states.makeElement(el, { when: true, appear: true }),
      })

      const props: Partial<CssProps<E>> = { onExited: batch(onExited, this.runExitedEffect) }

      if (exits.has(key)) props.when = false

      return result.set(key, { fresh: props.when !== false, el: cloneElement(el, props) })
    }, new Map())

    this.states.previous = this.states.current

    this.states.current = children

    this.forceUpdate()
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

    this.states.elements.forEach((item, key) => {
      const node = children.find((el) => el.key === key)

      if (!item.fresh || !node) return elements.push(item.el)

      const isChildrenEqual = item.el.props.children === node

      item.el = isChildrenEqual ? item.el : cloneElement(item.el, undefined, node)

      elements.push(item.el)
    })

    return elements
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const update = useForceUpdate()

  const states = useConstant(() => new TransitionState(props))

  const actions = useMemo(() => new TransitionAction(update, states), [update, states])

  // 不能直接在渲染期间 write ref
  // prettier-ignore
  useMemo(() => { actions.injectLatestProps(props) }, [actions, props])

  useEffect(() => actions.runFlipCleanup, [actions])

  return { states, actions }
}
