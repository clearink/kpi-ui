/* eslint-disable class-methods-use-this */
import { logger } from '../../../_utils'
import BaseControl from '../base_control'
import FormDispatchControl from './dispatch_control'
import FormStateControl from './state_control'

import type { NamePath } from '../../props'
import type { InternalFormInstance, InternalHookReturn } from '../../internal_props'
import { _getName } from '../../utils/path'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

// 部分逻辑耦合太多 ，现在拆开
export default class FormGroupControl<State = any> extends BaseControl {
  public $state = new FormStateControl<State>()

  public $dispatch = new FormDispatchControl<State>(this.$state)

  // 向外暴露的函数
  public injectForm = (): InternalFormInstance<State> => {
    const { $dispatch, $state } = this

    return {
      getFieldError: $state.getFieldError,
      getFieldsError: $state.getFieldsError,

      setFieldValue: $dispatch.setFieldValue,
      getFieldValue: $state.getFieldValue,

      setFieldsValue: $dispatch.setFieldsValue,
      getFieldsValue: $state.getFieldsValue,

      validateField: $dispatch.validateField,
      validateFields: $dispatch.validateFields,

      submitForm: $dispatch.submitForm,
      resetFields: $dispatch.resetFields,

      isFieldTouched: $dispatch.isFieldTouched,
      isFieldsTouched: $dispatch.isFieldsTouched,

      scrollToField: this.scrollToField,

      /** @public */
      getInternalHooks: this._getInternalHooks,
    }
  }

  // 内部属性
  public _getInternalHooks = (secret: string): InternalHookReturn | undefined => {
    const matched = secret === HOOK_MARK

    logger.warn(!matched, '`getInternalHooks` is internal usage. Should not call directly.')

    if (!matched) return undefined

    const { $dispatch, $state } = this

    return {
      setInitialValues: $state.setInitialValues,
      registerField: $dispatch.registerField,
      registerWatch: $state.registerWatch,
      setFieldMeta: $state.setFieldMeta,
      setFields: $dispatch.setFields,
      dispatch: $dispatch.dispatch,
      setFormProps: $state.setFormProps,
    }
  }

  /** ==================================================== */
  /** Features                                             */
  /** ==================================================== */

  // 滚动到对应位置
  public scrollToField = (namePath: NamePath = []) => {
    const key = _getName(namePath)

    if (!key) return

    const control = this.$state.getControls().find(({ _key }) => _key === key)

    const formName = this.$state._props.name
    const fieldId = control?._getId(formName)

    if (fieldId === undefined) return

    const dom = document.querySelector(`#${fieldId}`)
    // TODO: 这里是否要换其他方式呢？
    dom?.scrollIntoView({ behavior: 'smooth' })
  }
}
