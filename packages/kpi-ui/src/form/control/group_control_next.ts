/* eslint-disable class-methods-use-this, max-classes-per-file */
import cloneDeep from 'lodash.clonedeep'
import { isUndefined, logger, toArray } from '../../_utils'
import { setIn, getIn, deleteIn, mergeValue, cloneWithPath } from '../utils/value'
import BaseControl from './base_control'
import { getPaths, isDependent } from '../utils/path'

import type { NamePath } from '../props'
import type {
  UpdateFieldAction as Action,
  UpdateFieldActionType as ActionType,
  InternalNamePath,
} from '../internal_props'
import type FormFieldControl from './field_control'

// 字段值
class GroupFieldState<State = any> {
  private _state = {} as State

  public setFieldValue(namePath: InternalNamePath, value: any) {
    const prev = cloneWithPath(this._state, namePath)
    const next = setIn(this._state, namePath, value)
    return [prev, next] as const
  }

  public getFieldValue(namePath: NamePath) {
    const value = getIn(this._state, toArray(namePath))
    return cloneDeep(value)
  }

  public setFieldsValue(state: Partial<State>) {
    const prev = getPaths(state).reduce(cloneWithPath, this._state)
    const next = mergeValue(this._state, state)
    return [prev, next] as const
  }

  public getFieldsValue(controls: FormFieldControl[]) {
    const cloned = cloneDeep(this._state)
    return controls.reduce((values, { _name: name, _props: props }) => {
      // 不用获取列表项， 可以减小一些开销
      if (props.isListField) return values
      return setIn(values, name, getIn(cloned, name))
    }, {} as State)
  }

  public deleteFieldValue(namePath: NamePath) {
    const paths = toArray(namePath)
    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (paths.length === 0) this._state = {} as State
    else deleteIn(this._state, paths)
  }

  // 默认值
  protected _initial = {} as Partial<State>

  private setInitialValues(initial?: Partial<State>) {
    this._initial = initial || {}
  }

  private getInitialValue(name: NamePath) {
    const value = getIn(this._initial, toArray(name))
    return cloneDeep(value)
  }

  // 确保设置了字段初始值
  public ensureInitialized(control: FormFieldControl, dispatch: GroupFieldDispatch) {
    const namePath = control._name
    const $initialValue = control._props.initialValue
    if (!FormGroupControlNext._getName(namePath)) return // name 无效
    if (this.getFieldValue(namePath) !== undefined) return // 该字段值不为 undefined

    const topInitial = this.getInitialValue(namePath)
    const initialValue = isUndefined(topInitial) ? $initialValue : topInitial
    const invalid = !isUndefined(topInitial) && !isUndefined($initialValue)
    logger.warn(invalid, "form has initialValues, don't set field initialValue")

    if (isUndefined(initialValue)) return
    setIn(this._state, toArray(namePath), initialValue)
    dispatch.updateSameNameField(control) // 更新字段
  }
}

// 字段管理
class GroupFieldDispatch<State = any> {
  private $state = new GroupFieldState<State>()

  // 字段删除时是否保存属性
  protected _preserve = true

  protected _controls = new Set<FormFieldControl>()

  public get controls() {
    return Array.from(this._controls.values())
  }

  // 注册字段
  protected registerField(control: FormFieldControl) {
    const { _key: key, _name: name } = control

    this._controls.add(control)

    // 需要更新除自身以外的同名及上层字段， shouldUpdate 此处也不用更新
    this.$state.ensureInitialized(control, this)

    // 取消注册， 清除副作用
    return ($preserve?: boolean) => {
      const preserve = $preserve ?? this._preserve
      this._controls.delete(control) // 清空空字段

      const hasSameField = this.controls.find(({ _key }) => _key === key)
      // 不保留数据 && name 合法 && 没有同名字段
      // 依赖 FieldStateControl
      if (!preserve && key && !hasSameField) {
        this.$state.deleteFieldValue(name)
      }
    }
  }

  // 更新同名字段
  public updateSameNameField(control: FormFieldControl) {
    const controls = this.controls.filter(({ _name: name }) => {
      return control._key && isDependent(name, control._name, true)
    })
    controls.forEach((field) => field.forceUpdate())
  }

  /** ==================================================== */
  /** Scheduler                                            */
  /** ==================================================== */

  private updateControl(prev: State, next: State, type: ActionType) {
    // 获取需要更新的 control
    const uniqueControls = this.controls.reduce((set, control) => {
      if (control.shouldUpdate(prev, next, type)) set.add(control)
      return set
    }, new Set<FormFieldControl>())
    // 强制更新 control
    uniqueControls.forEach((control) => control.forceUpdate())
  }

  private dispatch(action: Action) {
    if (action.type === 'fieldEvent') {
      const [prev, next] = this.$state.setFieldValue(action.name, action.value)
      this.updateControl(prev, next, action.type)
    } else if (action.type === 'setField') {
      const [prev, next] = this.$state.setFieldValue(action.name, action.value)
      // ... 此处可能还会有 meta 属性
      this.updateControl(prev, next, action.type)
    } else if (action.type === 'removeField') {
      // ...删除字段时触发，主要时通知 dependinces
    } else if (action.type === 'resetField') {
      // ...重置字段是触发
    } else if (action.type === 'dependentField') {
      // ...
    }
  }

  private setFieldValue(namePath: NamePath, value: any) {
    this.dispatch({ type: 'setField', name: toArray(namePath), value })
  }

  /** ==================================================== */
  /** Features                                             */
  /** ==================================================== */
  protected validateField() {}

  protected validateFields() {}

  protected submitForm() {}

  protected resetFields() {}

  public isFieldTouched() {}

  public isFieldsTouched() {}
}

// 部分逻辑耦合太多 ，现在拆开
export default class FormGroupControlNext<State = any> extends BaseControl {
  // 表单名称
  public _name: string | undefined = undefined

  private $dispatch = new GroupFieldDispatch<State>()

  // 向外暴露的函数
  public injectForm() {
    return {
      // ...
    }
  }

  // 内部属性
  private _getInternalHooks(secret: symbol) {
    return {
      // ...
    }
  }

  /** ==================================================== */
  /** Features                                             */
  /** ==================================================== */

  // 滚动到对应位置
  private scrollToField(namePath: NamePath = []) {
    const key = FormGroupControlNext._getName(namePath)
    if (!key) return
    const control = this.$dispatch.controls.find(({ _key }) => _key === key)
    const fieldId = control?._getId(this._name)
    if (fieldId === undefined) return
    const dom = document.querySelector(`#${fieldId}`)
    // TODO: 这里是否要换其他方式呢？
    dom?.scrollIntoView({ behavior: 'smooth' })
  }
}
