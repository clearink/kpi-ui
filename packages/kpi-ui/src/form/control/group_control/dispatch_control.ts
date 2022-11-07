/* eslint-disable class-methods-use-this */
import FormStateControl from './state_control'
import { isDependent } from '../../utils/path'
import { isUndefined, logger } from '../../../_utils'

import type { FieldData, NamePath } from '../../props'
import type FormFieldControl from '../field_control'
import type {
  UpdateFieldAction as Action,
  UpdateFieldActionType as ActionType,
  FieldMeta,
} from '../../internal_props'

export const HOOK_MARK = Symbol.for('_$_KPI_FORM_HOOK_MARK_$_')

// 负责调度逻辑
export default class FormDispatchControl<State = any> {
  public constructor(private $state: FormStateControl<State>) {}

  private controls(pure = false) {
    return this.$state.controls(pure)
  }

  // 确保设置了字段初始值(registerField 调用)
  public ensureInitialized(control: FormFieldControl) {
    const namePath = control._name
    const $initialValue = control._props.initialValue

    const { $state } = this

    if (!control._key || !isUndefined($state.getFieldValue(namePath))) return

    const topInitial = $state.getInitialValue(namePath)
    const initialValue = isUndefined(topInitial) ? $initialValue : topInitial
    const invalid = !isUndefined(topInitial) && !isUndefined($initialValue)
    logger.warn(invalid, "form has initialValues, don't set field initialValue")

    if (isUndefined(initialValue)) return
    $state.setFieldValue(namePath, initialValue)
    // 更新同名字段
    const controls = this.controls(true).filter(({ _name: name }) => {
      return isDependent(name, namePath, true)
    })
    controls.forEach((field) => field.forceUpdate())
  }

  // 注册字段
  public registerField(control: FormFieldControl) {
    return this.$state.registerField(control, this)
  }

  // 更新视图
  public updateControl(prev: State, next: State, type: ActionType) {
    // 获取需要更新的 control
    const init = [new Set<FormFieldControl>(), new Set<FormFieldControl>()] as const
    const [controls, dependencies] = this.controls().reduce((res, control) => {
      if (!control.shouldUpdate(prev, next, type)) return res
      // ... 找出依赖当前 control 的其他 controls
      const implicates = this.$state.findImplicates(control._key)
      implicates.forEach((c) => res[1].add(c))
      return [res[0].add(control), res[1]]
    }, init)
    // 更新 control
    controls.forEach((control) => control.forceUpdate())
    // 校验依赖字段
    dependencies.forEach((control) => {
      const value = this.$state.getFieldValue(control._name)
      control.validate(value)
    })
  }

  // 调度方法
  public dispatch(action: Action) {
    const { $state } = this

    // 由用户事件主动触发
    if (action.type === 'fieldEvent') {
      const [prev, next] = $state.setFieldValue(action.name, action.value)
      return this.updateControl(prev, next, action.type)
    }

    // 调用 setFieldValue, setFields 方法
    if (action.type === 'setFields') {
      const { fields } = action
      // 更新字段 meta 属性
      fields.forEach((field) => this.setFieldMeta(field.name, field))
      // 获得更新数据
      const [prev, next] = $state.setBatchValue(fields)
      return this.updateControl(prev, next, action.type)
    }

    // 调用 setFieldsValue 方法
    if (action.type === 'setFieldsValue') {
      const [prev, next] = $state.setFieldsValue(action.state)
      return this.updateControl(prev, next, action.type)
    }

    // ...删除字段，主要时通知 dependence
    if (action.type === 'removeField') {
      return
    }

    // ...重置字段
    if (action.type === 'resetField') {
      return
    }

    // ...字段依赖
    if (action.type === 'dependentField') {
      return
    }

    logger.error(true, 'invalid action type')
  }

  // 设置一组字段状态
  public setFields(fields: FieldData[]) {
    this.dispatch({ type: 'setFields', fields })
  }

  // 设置字段值
  public setFieldValue(name: NamePath, value: any) {
    this.dispatch({ type: 'setFields', fields: [{ name, value }] })
  }

  // 设置多个字段值
  public setFieldsValue(state: Partial<State>) {
    this.dispatch({ type: 'setFieldsValue', state })
  }

  // 获取字段以及meta
  private getFields() {
    return this.controls(true).map((control) => {
      const meta = control.getFieldMeta()
      const name = control._name
      const value = this.$state.getFieldValue(control._name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...meta, name, value }
    })
  }

  // 设置 FormField 的 meta 属性
  public setFieldMeta(namePath: NamePath, meta: Partial<FieldMeta>) {
    for (const control of this.controls(true)) {
      if (!isDependent(control._name, namePath)) continue
      control.setFieldMeta(meta)
    }
  }

  public resetFields() {}

  // 通知监听字段
  public publishWatch() {}

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  public submitForm() {}

  // 校验指定字段
  public validateField(namePath: NamePath) {
    return this.validateFields([namePath])
  }

  // 校验多个字段, 不传默认校验全部
  public validateFields(fields: NamePath[] = []) {
    const list = this.controls(true)
      .filter((control) => {
        // 空数组视为校验全部字段
        if (fields.length === 0) return true
        return fields.some((namePath) => {
          return isDependent(control._name, namePath)
        })
      })
      .map((control) => {
        const value = this.$state.getFieldValue(control._name)
        return control.validate(value)
      })
    // TODO: 确定逻辑
    return Promise.all(list).then(() => this.$state.getFieldsValue(fields))
  }

  public isFieldTouched(namePath: NamePath) {
    return this.isFieldsTouched([namePath])
  }

  // 检查全部字段是否都触发过 onBlur
  public isFieldsTouched(fields: NamePath[] = []) {
    const untouchedFields = this.controls(true).filter((control) => {
      if (fields.length === 0) return false
      const { touched } = control.getFieldMeta()
      const implicate = fields.some((fieldName) => {
        return isDependent(control._name, fieldName)
      })
      return implicate && !touched
    })
    return untouchedFields.length === 0
  }

  // TODO
  public triggerOnFieldsChange() {}

  public triggerOnValuesChange() {}
}
