/* eslint-disable class-methods-use-this */

import FormControl, { HOOK_MARK } from './form_control'
import type { InternalFormInstance } from '../internal_props'
import type { AnyObject } from '../../_types'
import type { NamePath } from '../props'

export default class FormGroupControl<Value = AnyObject> extends FormControl<Value> {
  get state() {
    // 1. 收集所有的controls
    // 2. 获取他们的

    return {} as Value
  }

  // TODO: 待优化 userForm 返回值
  get inject(): InternalFormInstance<Value> {
    return {
      state: this.state,
      validate: this.validate,
      submit: this.submit,
      resetFields: this.resetFields,
      getInternalHooks: this.getInternalHooks,
    }
  }

  private getInternalHooks(secret: string) {
    return secret === HOOK_MARK ? this : undefined
  }

  private resetFields() {}

  override removeControl(namePath?: NamePath) {
    super.removeControl(namePath)
    // preserve = false 删除对应path的数据
  }
}
