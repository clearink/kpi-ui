/* eslint-disable class-methods-use-this */
import type { MutableRefObject } from 'react'
import { toArray } from '../../_utils'
import type { NamePath } from '../props'

const SEPARATOR = '_$_KPI_FORM_CONTROL_$_'
export default class BaseControl {
  forceUpdate = () => {}

  constructor(_forceUpdate: () => void, mounted: MutableRefObject<boolean>) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => mounted.current && _forceUpdate()
  }

  // 获取名称字符串
  static _getName(namePath: NamePath) {
    const paths = toArray(namePath)
    return paths.map((item) => `${typeof item}:${item}`).join(SEPARATOR)
  }
}
