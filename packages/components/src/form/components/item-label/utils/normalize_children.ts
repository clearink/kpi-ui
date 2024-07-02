import { isString } from '@kpi-ui/utils'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelProps } from '../props'

// 格式化 FormItemLabel
export default function normalizeChildren(props: FormItemLabelProps, ctx: FormContextState) {
  const { colon, label, required, requiredMark, tooltip } = props

  const hasColon = ctx.layout !== 'vertical' && colon

  let labelNode = label

  if (hasColon && isString(labelNode)) {
    // 去除用户输入的 colon
    labelNode = labelNode.replace(/[:|：]\s*$/, '')
  }
  // TODO: optional mark
  if (requiredMark === 'optional' && !required) {
    //
  }
  // TODO: tooltip
  if (tooltip) {
    //
  }

  return labelNode
}
