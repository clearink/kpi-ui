/* eslint-disable class-methods-use-this */
export default class BaseControl {
  public forceUpdate = () => {}

  constructor(_forceUpdate: () => void, mounted: () => boolean) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => {
      mounted() && _forceUpdate()
    }
  }
}
