import FormGroupControl from './group_control'
import FormFieldControl from './field_control'
import type { NamePath } from '../props'

// FormArray(特殊的FormField)
export default class FormArrayControl extends FormFieldControl {
  // 注册子控件
  registerField(control: FormFieldControl) {
    if (!this._parent || !(this._parent instanceof FormGroupControl)) {
      // logger.warn('无法正确注册')
      // 父级不存在或者父级不是FormGroupControl
      return () => {}
    }
    return this._parent.registerField(control)
  }

  /** ===================================================== */
  /** features                                              */
  /** ===================================================== */

  // add() {}

  // delete() {}

  // remove() {}
  // 可以直接操作 root._state
}
