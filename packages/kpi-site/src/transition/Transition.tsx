export interface TransitionProps {
  name: string
  type?: 'transition' | 'animation'
  duration?: number | { enter: number; leave: number }
  appear?: boolean
  css?: boolean
  mode?: 'in-out' | 'out-in' | 'default'
  // class
  classNames?: {
    appear?: string
    appearActive?: string
    appearTo?: string
    enter?: string
    enterActive?: string
    enterTo?: string
    exit?: string
    exitActive?: string
    exitTo?: string
  }
  // events
  onEnter?: () => any
  onEntering?: () => any
  onEntered?: () => any
  onEnterCancelled?: () => any
  onExit: () => any
  onExiting?: () => any
  onExited?: () => any
  onExitCancelled?: () => any
  onAppear?: () => any
  onAppeared?: () => any
  onAppearCancelled?: () => any
}
export default function Transition(props: TransitionProps) {}
