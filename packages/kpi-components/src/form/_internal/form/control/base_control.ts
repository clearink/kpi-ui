import { noop } from '@kpi-ui/utils'

/* eslint-disable class-methods-use-this */
export default class BaseControl {
  public forceUpdate = noop

  constructor(_forceUpdate: () => void, mounted: () => boolean) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => {
      mounted() && _forceUpdate()
    }
  }
}
