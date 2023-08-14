/* eslint-disable max-classes-per-file */
import decompose from '../../utils/decompose'

import type { AnimatableValue } from '../interface'

export interface GeneratorItem {
  decompose: () => { numbers: number[]; strings: string[]; numeric: boolean }
}

export class ElementGeneratorItem<V extends AnimatableValue> {
  decompose: GeneratorItem['decompose']

  constructor(element: Element, property: string, original: V) {
    this.decompose = () => decompose(original)
  }
}

export class ValueGeneratorItem<V extends AnimatableValue> {
  private decomposed: null | ReturnType<typeof decompose> = null

  decompose: GeneratorItem['decompose']

  constructor(original: V) {
    this.decompose = () => {
      if (!this.decomposed) this.decomposed = decompose(original)

      return this.decomposed
    }
  }
}
