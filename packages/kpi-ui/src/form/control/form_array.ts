import FormControl from './form_control'
import type { NamePath } from '../props'

export default class FormArrayControl<Value = any> extends FormControl<Value> {
  override removeControl(namePath?: NamePath) {
    super.removeControl(namePath)
    // preserve = false 删除对应path的数据
  }
}
