/* eslint-disable class-methods-use-this */
import { logger } from '../../../_utils'
import BaseControl from '../base_control'
import FormDispatchControl from './dispatch_control'
import FormStateControl from './state_control'

import type { NamePath } from '../../props'
import type { InternalFormInstance, InternalHookReturn } from '../../internal_props'
import { _getName } from '../../utils/path'

export const HOOK_MARK = Symbol.for('_$_KPI_FORM_HOOK_MARK_$_')

// 部分逻辑耦合太多 ，现在拆开
export default class FormGroupControl<State = any> extends BaseControl {
  public $state = new FormStateControl<State>()

  public $dispatch = new FormDispatchControl<State>(this.$state)

  // 向外暴露的函数
  public injectForm(): InternalFormInstance<State> {
    const { $dispatch, $state } = this

    return {
      setFieldValue: $dispatch.setFieldValue.bind($dispatch),
      getFieldValue: $state.getFieldValue.bind($state),

      setFieldsValue: $dispatch.setFieldsValue.bind($dispatch),
      getFieldsValue: $state.getFieldsValue.bind($state),

      validateField: $dispatch.validateField.bind($dispatch),
      validateFields: $dispatch.validateFields.bind($dispatch),

      submitForm: $dispatch.submitForm.bind($dispatch),
      resetFields: $dispatch.resetFields.bind($dispatch),

      isFieldTouched: $dispatch.isFieldTouched.bind($dispatch),
      isFieldsTouched: $dispatch.isFieldsTouched.bind($dispatch),

      scrollToField: this.scrollToField.bind(this),

      /** @public */
      getInternalHooks: this._getInternalHooks.bind(this),
    }
  }

  // 内部属性
  public _getInternalHooks(secret: symbol): InternalHookReturn | undefined {
    const matched = secret === HOOK_MARK

    logger.warn(!matched, '`getInternalHooks` is internal usage. Should not call directly.')

    if (!matched) return undefined

    const { $dispatch, $state } = this

    return {
      setInitialValues: $state.setInitialValues.bind($state),
      registerField: $dispatch.registerField.bind($dispatch),
      registerWatch: $state.registerWatch.bind($state),
      subscribe: $state.subscribe.bind($state),
      setFieldMeta: $dispatch.setFieldMeta.bind($dispatch),
      dispatch: $dispatch.dispatch.bind($dispatch),
      setFormProps: $state.setFormProps.bind($state),
    }
  }

  /** ==================================================== */
  /** Features                                             */
  /** ==================================================== */

  // 滚动到对应位置
  public scrollToField(namePath: NamePath = []) {
    const key = _getName(namePath)

    if (!key) return

    const control = this.$state.controls().find(({ _key }) => _key === key)

    const formName = this.$state._props.name
    const fieldId = control?._getId(formName)

    if (fieldId === undefined) return

    const dom = document.querySelector(`#${fieldId}`)
    // TODO: 这里是否要换其他方式呢？
    dom?.scrollIntoView({ behavior: 'smooth' })
  }
}
