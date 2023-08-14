import decompose from '../../../../utils/decompose'

import { AnimatableValue } from '../../../interface'

export default class GeneratorItem<V extends AnimatableValue> {
  private decomposed: null | ReturnType<typeof decompose> = null

  decompose: () => ReturnType<typeof decompose>

  constructor(original: V) {
    this.decompose = () => {
      if (!this.decomposed) this.decomposed = decompose(original)

      return this.decomposed
    }
  }
}
