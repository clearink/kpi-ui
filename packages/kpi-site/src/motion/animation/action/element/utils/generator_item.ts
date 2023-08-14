import decompose from '../../../../utils/decompose'

import { AnimatableValue } from '../../../interface'

export default class GeneratorItem<V extends AnimatableValue> {
  decompose: () => ReturnType<typeof decompose>

  constructor(element: Element, property: string, original: V) {
    this.decompose = () => decompose(original)
  }
}
