import decompose from '../../utils/decompose'

type CanTweenValue = ReturnType<typeof decompose>
export interface TweenAnimation {
  readonly tuple: [CanTweenValue, CanTweenValue]

  ensureInitialized: () => void
}
