import { fallback, isObjectLike } from '@kpi-ui/utils'

import type { SegmentedOption, SegmentedProps, SegmentedType } from '../props'

export function normalizeOptions<T extends SegmentedType = SegmentedType>(
  options: SegmentedProps<T>['options'] = [],
): SegmentedOption<T>[] {
  return options.map((item: T | SegmentedOption<T>) => {
    if (isObjectLike(item)) {
      const { title, label } = item

      const htmlTitle = fallback(title, isObjectLike(label) ? undefined : `${label}`)

      return { ...item, title: htmlTitle }
    }

    return { value: item, label: item, title: `${item}` }
  })
}
