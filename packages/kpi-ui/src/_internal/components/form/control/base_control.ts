/* eslint-disable class-methods-use-this */
import type { MutableRefObject } from 'react'

export default class BaseControl {
  public forceUpdate = () => {}

  constructor(_forceUpdate: () => void, mounted: MutableRefObject<boolean>) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => mounted.current && _forceUpdate()
  }
}
